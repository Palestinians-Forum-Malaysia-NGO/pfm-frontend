import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdPersonAdd, MdArrowForward, MdArrowBack, MdEmail } from "react-icons/md";
import InputField    from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import { useAuth, useRegister, useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { OTP_PURPOSE } from "components/features/auth/types";

const RULES = {
  email:    [{ required: true, message: "Email is required" }, { email: true }],
  password: [{ required: true, message: "Password is required" }, { minLength: 8, message: "At least 8 characters" }],
};

/* ──────────────────────────────────────────────
   Step 1 — Registration form
────────────────────────────────────────────── */
const RegisterStep = ({ onOtpRequired }) => {
  const { execute: register, loading, error } = useRegister();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});
    try {
      const data = await register(formData);
      onOtpRequired({ email: formData.email, channel: data.channel ?? "email" });
    } catch {
      // error handled by useRegister
    }
  };

  return (
    <>
      <div className="mb-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdPersonAdd className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Create account</h1>
        <p className="mt-1 text-sm text-slate-400">Join the PFM community portal.</p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <InputField
          label="Email Address" field="email" type="email"
          placeholder="you@example.com"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.email}
        />
        <PasswordField
          label="Password" field="password"
          placeholder="Min. 8 characters"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.password}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : <><MdArrowForward className="h-4 w-4" /> Create Account</>
          }
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/auth/sign-in" className="font-medium text-green transition-colors hover:text-[#006833]">
          Sign in
        </Link>
      </p>
    </>
  );
};

/* ──────────────────────────────────────────────
   Step 2 — OTP verification
────────────────────────────────────────────── */
const OtpStep = ({ email, channel, onBack }) => {
  const { verifyOtp } = useAuth();
  const [code, setCode]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState("");
  const [resent, setResent]       = useState(false);
  const [resending, setResending] = useState(false);

  const isReady = code.trim().length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    setApiError("");
    setLoading(true);
    try {
      // Use "register" purpose for registration OTP
      await verifyOtp({ email, code: code.trim(), purpose: OTP_PURPOSE.REGISTER });
    } catch (err) {
      const res = err.response?.data;
      setApiError(res?.detail ?? res?.code?.[0] ?? "Invalid or expired code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setResent(false);
    setCode("");
    try {
      await authService.resendOtp({ email, purpose: OTP_PURPOSE.REGISTER });
      setResent(true);
    } catch {
      setApiError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="mb-7">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700">
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10">
          <MdEmail className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Verify your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          We sent a 6-digit code via{" "}
          <span className="font-semibold text-slate-600">{channel}</span> to{" "}
          <span className="font-semibold text-slate-600">{email}</span>
        </p>
      </div>

      <AlertBanner message={apiError} />
      {resent && <AlertBanner message="A new code has been sent." variant="success" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">6-Digit Code</label>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="——————"
            autoFocus
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-2xl font-bold tracking-[0.6em] text-slate-900 outline-none transition-all duration-200 focus:border-green focus:bg-white placeholder:tracking-normal placeholder:text-base placeholder:font-normal"
          />
          <p className="mt-1.5 text-center text-xs text-slate-400">{code.length}/6 digits entered</p>
        </div>

        <button
          type="submit"
          disabled={loading || !isReady}
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Verify & Continue"
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
    </>
  );
};

/* ──────────────────────────────────────────────
   Main — orchestrates steps
────────────────────────────────────────────── */
export default function Register() {
  const [step, setStep]       = useState("register");
  const [otpMeta, setOtpMeta] = useState({ email: "", channel: "" });

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      {step === "register" ? (
        <RegisterStep
          onOtpRequired={({ email, channel }) => {
            setOtpMeta({ email, channel });
            setStep("otp");
          }}
        />
      ) : (
        <OtpStep
          email={otpMeta.email}
          channel={otpMeta.channel}
          onBack={() => setStep("register")}
        />
      )}
    </div>
  );
}
