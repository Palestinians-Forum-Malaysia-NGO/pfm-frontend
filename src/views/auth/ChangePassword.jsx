import React, { useState } from "react";
import { MdLock, MdCheckCircle } from "react-icons/md";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import { usePasswordChange } from "components/features/auth/hooks";

const RULES = {
  old_password: [{ required: true, message: "Current password is required" }],
  new_password: [{ required: true, message: "New password is required" }, { minLength: 8, message: "At least 8 characters" }],
};

export default function ChangePassword() {
  const [formData, setFormData] = useState({ old_password: "", new_password: "" });
  const [errors, setErrors]     = useState({});
  const [apiError, setApiError] = useState("");
  const [done, setDone]         = useState(false);
  const [loading, setLoading]   = useState(false);

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
    setApiError("");
    setLoading(true);
    try {
      await authService.changePassword(formData);
      setDone(true);
    } catch (err) {
      setApiError(
        err.response?.data?.detail
          ?? err.response?.data?.old_password?.[0]
          ?? "Failed to change password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdCheckCircle className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">Password updated!</h1>
        <p className="mt-2 text-sm text-slate-400">
          Your password has been changed successfully.
        </p>
        <button
          onClick={() => { setDone(false); setFormData({ old_password: "", new_password: "" }); }}
          className="mt-7 flex h-11 w-full items-center justify-center rounded-full border border-slate-200 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-50 active:scale-[0.98]"
        >
          Change again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      {/* Header */}
      <div className="mb-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdLock className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Change password</h1>
        <p className="mt-1 text-sm text-slate-400">
          Update your account password. You'll need your current password.
        </p>
      </div>

      <AlertBanner message={apiError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <PasswordField
          label="Current Password" field="old_password"
          placeholder="Enter current password"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.old_password}
        />
        <PasswordField
          label="New Password" field="new_password"
          placeholder="Min. 8 characters"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.new_password}
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            : "Update Password"
          }
        </button>
      </form>
    </div>
  );
}
