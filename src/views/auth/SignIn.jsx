import React, { useState } from "react";
import InputField from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import { validate } from "components/form/utils/validation";
import Checkbox from "components/checkbox";

const EMAIL_RULES    = [{ required: true }, { email: true }];
const PASSWORD_RULES = [{ required: true }, { minLength: 8, message: "Password must be at least 8 characters" }];

export default function SignIn() {
  const [formData, setFormData]         = useState({ email: "", password: "" });
  const [errors, setErrors]             = useState({});
  const [apiError, setApiError]         = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [loading, setLoading]           = useState(false);

  const updateFormData = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Catch any fields the user never touched (skipped blur)
    const newErrors = {};
    const emailErr    = validate(formData.email, EMAIL_RULES);
    const passwordErr = validate(formData.password, PASSWORD_RULES);
    if (emailErr)    newErrors.email    = emailErr;
    if (passwordErr) newErrors.password = passwordErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});
    setApiError("");
    setLoading(true);
    try {
      // TODO: call auth service
    } catch (err) {
      setApiError(err?.message || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      {/* Header */}
      <div className="mb-7">
        <span className="inline-block rounded-full bg-green/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-green">
          Portal Access
        </span>
        <h1 className="mt-3 text-2xl font-bold text-navy-700">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign in to your PFM account to continue.
        </p>
      </div>

      {/* API error banner */}
      {apiError && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {apiError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <InputField
          label="Email address"
          field="email"
          type="email"
          placeholder="you@example.com"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
          rules={EMAIL_RULES}
        />

        <PasswordField
          label="Password"
          field="password"
          placeholder="Enter your password"
          formData={formData}
          errors={errors}
          updateFormData={updateFormData}
          rules={PASSWORD_RULES}
        />

        {/* Remember + Forgot */}
        <div className="mb-5 flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <Checkbox
              color="green"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              extra="cursor-pointer"
            />
            <span className="text-sm text-slate-600">Remember me</span>
          </label>
          <a
            href="#"
            className="text-sm font-medium text-green transition-colors duration-200 hover:text-[#006833]"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 ease-in-out hover:bg-[#006833] active:bg-[#005629] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Need access?{" "}
        <a href="#" className="font-medium text-green transition-colors duration-200 hover:text-[#006833]">
          Contact the administrator
        </a>
      </p>

    </div>
  );
}
