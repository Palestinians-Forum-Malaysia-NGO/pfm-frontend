import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdLockReset, MdArrowBack } from "react-icons/md";
import InputField  from "components/form/InputField";
import AlertBanner from "components/ui/AlertBanner";
import { validate } from "components/form/utils/validation";
import { useForgotPassword } from "components/features/auth/hooks";

const EMAIL_RULES = [{ required: true, message: "Email is required" }, { email: true }];

export default function ForgotPassword() {
  const navigate = useNavigate();

  const { execute: forgotPassword, loading, error } = useForgotPassword();

  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors]     = useState({});
  const [sent, setSent]         = useState(false);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate(formData.email, EMAIL_RULES);
    if (err) { setErrors({ email: err }); return; }

    setErrors({});
    try {
      await forgotPassword({ email: formData.email });
      setSent(true);
    } catch {
      // error handled by useForgotPassword
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdLockReset className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">Check your email</h1>
        <p className="mt-2 text-sm text-slate-400">
          We sent a password reset link to{" "}
          <span className="font-semibold text-slate-700">{formData.email}</span>.
          Click the link in the email to reset your password.
        </p>
        <button
          onClick={() => navigate("/auth/reset-password")}
          className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-[#006833] active:scale-[0.98]"
        >
          Enter Reset Token
        </button>
        <button
          onClick={() => setSent(false)}
          className="mt-3 w-full text-center text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      {/* Header */}
      <div className="mb-7">
        <Link
          to="/auth/sign-in"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> Back to sign in
        </Link>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50">
          <MdLockReset className="h-6 w-6 text-amber-500" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Forgot password?</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <InputField
          label="Email address" field="email" type="email"
          placeholder="you@example.com"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={EMAIL_RULES}
        />

        <button
          type="submit"
          disabled={loading}

          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Send Reset Link"
          }
        </button>
      </form>
    </div>
  );
}
