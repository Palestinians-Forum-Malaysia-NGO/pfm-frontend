import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MdEmail, MdArrowBack } from "react-icons/md";
import InputField    from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import Checkbox      from "components/checkbox";
import { useAuth, useLogin, useVerifyOtp, useResendOtp } from "components/features/auth/hooks";

const EMAIL_RULES    = [{ required: true }, { email: true }];
const PASSWORD_RULES = [{ required: true }, { minLength: 8, message: "Password must be at least 8 characters" }];

/* ──────────────────────────────────────────────
   Step 1 — Email + Password
────────────────────────────────────────────── */
const LoginStep = ({ onOtpRequired }) => {
  const { completeLogin }                        = useAuth();
  const { execute: login, loading, error: loginError } = useLogin();
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const updateFormData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailErr    = validate(formData.email,    EMAIL_RULES);
    const passwordErr = validate(formData.password, PASSWORD_RULES);
    if (emailErr)    newErrors.email    = emailErr;
    if (passwordErr) newErrors.password = passwordErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});

    try {
      const data = await login({ email: formData.email, password: formData.password });
      if (data.requires_otp) {
        onOtpRequired({ email: formData.email, channel: data.channel });
      } else {
        await completeLogin();
      }
    } catch {
      // error state handled by useLogin hook
    }
  };

  return (
    <>
      <div className="mb-7">
        <span className="inline-block rounded-full bg-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-green">
          Portal Access
        </span>
        <h1 className="mt-3 text-2xl font-bold text-navy-700">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">Sign in to your PFM account to continue.</p>
      </div>

      <AlertBanner message={loginError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <InputField
          label="Email address" field="email" type="email"
          placeholder="you@example.com"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={EMAIL_RULES}
        />
        <PasswordField
          label="Password" field="password"
          placeholder="Enter your password"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={PASSWORD_RULES}
        />

        <div className="mb-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox color="green" checked={keepLoggedIn} onChange={(e) => setKeepLoggedIn(e.target.checked)} extra="cursor-pointer" />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <a href="/auth/forgot-password" className="text-sm font-medium text-green transition-colors duration-200 hover:text-[#006833]">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:bg-[#005629] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Sign In"
          }
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-green transition-colors duration-200 hover:text-[#006833]">
          Create one
        </Link>
      </p>
    </>
  );
};

/* ──────────────────────────────────────────────
   Step 2 — OTP Verification
────────────────────────────────────────────── */
const OtpStep = ({ email, channel, onBack }) => {
  const { completeLogin }                                    = useAuth();
  const { execute: verifyOtp, loading, error: otpError }    = useVerifyOtp();
  const { execute: resendOtp, loading: resending }          = useResendOtp();
  const [code, setCode]   = useState("");
  const [resent, setResent] = useState(false);

  const isReady = code.trim().length === 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isReady) return;
    try {
      await verifyOtp({ email, code: code.trim() });
      await completeLogin();
    } catch {
      // error state handled by useVerifyOtp hook
    }
  };

  const handleResend = async () => {
    setResent(false);
    setCode("");
    try {
      await resendOtp({ email, purpose: "login" });
      setResent(true);
    } catch {
      // error handled by useResendOtp
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
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Verify your identity</h1>
        <p className="mt-1 text-sm text-slate-400">
          We sent a 6-digit code via{" "}
          <span className="font-semibold text-slate-600">{channel}</span> to{" "}
          <span className="font-semibold text-slate-600">{email}</span>
        </p>
      </div>

      <AlertBanner message={otpError} />
      {resent && <AlertBanner message="A new code has been sent." variant="success" />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-700">
            6-Digit Code
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
          <p className="mt-1.5 text-center text-xs text-slate-400">
            {code.length}/6 digits entered
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !isReady}
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Verify & Sign In"
          }
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Didn't receive it?{" "}
        <button
          onClick={handleResend}
          disabled={resending}
          className="font-medium text-green transition-colors hover:text-[#006833] disabled:opacity-50"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </p>
    </>
  );
};

/* ──────────────────────────────────────────────
   Main SignIn — orchestrates steps
────────────────────────────────────────────── */
export default function SignIn() {
  const [step, setStep]       = useState("login"); // "login" | "otp"
  const [otpMeta, setOtpMeta] = useState({ email: "", channel: "" });

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      {step === "login" ? (
        <LoginStep
          onOtpRequired={({ email, channel }) => {
            setOtpMeta({ email, channel });
            setStep("otp");
          }}
        />
      ) : (
        <OtpStep
          email={otpMeta.email}
          channel={otpMeta.channel}
          onBack={() => setStep("login")}
        />
      )}
    </div>
  );
}
