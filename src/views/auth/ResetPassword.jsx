import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { MdLockReset, MdArrowBack, MdCheckCircle } from "react-icons/md";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import authService   from "components/features/auth/services/authService";

const PASSWORD_RULES = [
  { required: true, message: "New password is required" },
  { minLength: 8, message: "At least 8 characters" },
];

export default function ResetPassword() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const prefilled = location.state?.email ?? "";

  const [email, setEmail]         = useState(prefilled);
  const [otp, setOtp]             = useState("");
  const [formData, setFormData]   = useState({ new_password: "" });
  const [errors, setErrors]       = useState({});
  const [apiError, setApiError]   = useState("");
  const [loading, setLoading]     = useState(false);
  const [done, setDone]           = useState(false);
  const [resending, setResending] = useState(false);
  const [resent, setResent]       = useState(false);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwErr = validate(formData.new_password, PASSWORD_RULES);
    if (pwErr) { setErrors({ new_password: pwErr }); return; }
    if (!otp.trim()) { setErrors({ otp: "OTP code is required" }); return; }

    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      await authService.resetPassword({
        email,
        otp: otp.trim(),
        new_password: formData.new_password,
      });
      setDone(true);
    } catch (err) {
      setApiError(
        err.response?.data?.detail ?? "Reset failed. Check your code and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    try {
      await authService.resendOtp({ email, purpose: "password_reset" });
      setResent(true);
    } catch {
      setApiError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdCheckCircle className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">Password reset!</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <Link
          to="/auth/sign-in"
          className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-[#006833] active:scale-[0.98]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      {/* Header */}
      <div className="mb-7">
        <Link
          to="/auth/forgot-password"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> Back
        </Link>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdLockReset className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Reset password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enter the code sent to{" "}
          <span className="font-semibold text-slate-700">{email || "your email"}</span>{" "}
          and choose a new password.
        </p>
      </div>

      <AlertBanner message={apiError} />
      {resent && <AlertBanner message="A new code has been sent." variant="success" />}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Email (editable if not prefilled) */}
        {!prefilled && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition-all duration-200 focus:border-green focus:bg-white"
            />
          </div>
        )}

        {/* OTP */}
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">Reset Code</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            placeholder="Enter code"
            className={`w-full rounded-xl border px-4 py-2.5 text-center text-xl font-bold tracking-[0.5em] outline-none transition-all duration-200 placeholder:tracking-normal placeholder:text-base placeholder:font-normal ${
              errors.otp
                ? "border-red-300 bg-red-50"
                : "border-slate-200 bg-slate-50 focus:border-green focus:bg-white"
            }`}
          />
          {errors.otp && <p className="mt-1 text-xs text-red-500">{errors.otp}</p>}
        </div>

        {/* New password */}
        <PasswordField
          label="New Password" field="new_password"
          placeholder="Min. 8 characters"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={PASSWORD_RULES}
        />

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Reset Password"
          }
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        Didn't receive a code?{" "}
        <button
          onClick={handleResend}
          disabled={resending}
          className="font-medium text-green transition-colors hover:text-[#006833] disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend"}
        </button>
      </p>
    </div>
  );
}
