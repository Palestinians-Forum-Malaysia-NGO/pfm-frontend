import React, { useState } from "react";
import { MdLockOpen, MdCheckCircle } from "react-icons/md";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import { useSetPassword, useAuth } from "components/features/auth/hooks";

const PASSWORD_RULES = [
  { required: true, message: "Password is required" },
  { minLength: 8,   message: "At least 8 characters" },
];

export default function SetPassword() {
  const { execute: setPassword, loading, error } = useSetPassword();
  const { completeLogin } = useAuth();

  const [formData, setFormData] = useState({ new_password: "", confirm_password: "" });
  const [errors, setErrors]     = useState({});
  const [done, setDone]         = useState(false);
  const [navigating, setNavigating] = useState(false);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const pwErr = validate(formData.new_password, PASSWORD_RULES);
    if (pwErr) newErrors.new_password = pwErr;
    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});
    try {
      await setPassword({ new_password: formData.new_password });
      setDone(true);
    } catch {
      // error handled by hook
    }
  };

  const handleContinue = async () => {
    setNavigating(true);
    try {
      await completeLogin();
    } catch {
      setNavigating(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdCheckCircle className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">Password set!</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your account is now fully activated. Click below to go to your dashboard.
        </p>
        <button
          onClick={handleContinue}
          disabled={navigating}
          className="mt-7 flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:opacity-60"
        >
          {navigating
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Go to Dashboard"
          }
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      <div className="mb-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10">
          <MdLockOpen className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Set your password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Create a strong password to secure your account. You'll use this to sign in going forward.
        </p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <PasswordField
          label="New Password" field="new_password"
          placeholder="Min. 8 characters"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={PASSWORD_RULES}
        />
        <PasswordField
          label="Confirm Password" field="confirm_password"
          placeholder="Re-enter your password"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={[{ required: true }]}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-green-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Set Password & Activate"
          }
        </button>
      </form>
    </div>
  );
}
