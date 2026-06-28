import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdEmail, MdArrowBack, MdMarkEmailRead } from "react-icons/md";
import InputField  from "components/form/InputField";
import AlertBanner from "components/ui/AlertBanner";
import { validate } from "components/form/utils/validation";
import { useVerifyOtp, useResendOtp } from "components/features/auth/hooks";
import { setTokens } from "components/features/auth/utils";

const EMAIL_RULES = [{ required: true }, { email: true }];

/* ──────────────────────────────────────────────
   Step 1 — Enter email to request OTP
────────────────────────────────────────────── */
const EmailStep = ({ onSent }) => {
  const { execute: resendOtp, loading, error } = useResendOtp();
  const [formData, setFormData] = useState({ email: "" });
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validate(formData.email, EMAIL_RULES);
    if (emailErr) { setErrors({ email: emailErr }); return; }
    setErrors({});
    try {
      await resendOtp({ email: formData.email, purpose: "register" });
      onSent(formData.email);
    } catch {
      // error handled by hook
    }
  };

  return (
    <>
      <div className="mb-7">
        <Link
          to="/auth/sign-in"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> Back to sign in
        </Link>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10">
          <MdMarkEmailRead className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Activate your account</h1>
        <p className="mt-1 text-sm text-slate-400">
          Enter the email address your account was created with. We'll send you a one-time code to get started.
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
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Send Activation Code"
          }
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have a password?{" "}
        <Link to="/auth/sign-in" className="font-medium text-green transition-colors hover:text-green-600">
          Sign in
        </Link>
      </p>
    </>
  );
};

/* ──────────────────────────────────────────────
   Step 2 — Enter OTP
────────────────────────────────────────────── */
const OtpStep = ({ email, onBack }) => {
  const navigate = useNavigate();
  const { execute: verifyOtp, loading, error: otpError } = useVerifyOtp();
  const { execute: resendOtp, loading: resending }        = useResendOtp();
  const [code, setCode]   = useState("");
  const [resent, setResent] = useState(false);

  const isReady = code.trim().length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    try {
      const data = await verifyOtp({ email, code: code.trim(), purpose: "register" });
      if (data.access) setTokens({ access: data.access, refresh: data.refresh });
      navigate("/auth/set-password");
    } catch {
      // error handled by hook
    }
  };

  const handleResend = async () => {
    setResent(false);
    setCode("");
    try {
      await resendOtp({ email, purpose: "register" });
      setResent(true);
    } catch {}
  };

  return (
    <>
      <div className="mb-7">
        <button
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> Back
        </button>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10">
          <MdEmail className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Check your email</h1>
        <p className="mt-1 text-sm text-slate-400">
          We sent a 6-digit code to{" "}
          <span className="font-semibold text-slate-700">{email}</span>
        </p>
      </div>

      <AlertBanner message={otpError} />
      {resent && <AlertBanner message="A new code has been sent." variant="success" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            Activation Code
          </label>
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
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Verify & Continue"
          }
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Didn't receive it?{" "}
        <button
          onClick={handleResend}
          disabled={resending}
          className="font-medium text-green transition-colors hover:text-green-600 disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend code"}
        </button>
      </p>
    </>
  );
};

/* ──────────────────────────────────────────────
   Main — orchestrates steps
────────────────────────────────────────────── */
export default function ActivateAccount() {
  const [step, setStep]   = useState("email"); // "email" | "otp"
  const [email, setEmail] = useState("");

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      {step === "email" ? (
        <EmailStep
          onSent={(addr) => { setEmail(addr); setStep("otp"); }}
        />
      ) : (
        <OtpStep
          email={email}
          onBack={() => setStep("email")}
        />
      )}
    </div>
  );
}
