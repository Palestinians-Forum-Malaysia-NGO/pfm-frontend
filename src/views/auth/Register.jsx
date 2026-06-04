import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdPersonAdd, MdArrowForward } from "react-icons/md";
import InputField    from "components/form/InputField";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import { validate }  from "components/form/utils/validation";
import authService   from "components/features/auth/services/authService";

const RULES = {
  full_name: [{ required: true, message: "Full name is required" }],
  email:     [{ required: true, message: "Email is required" }, { email: true }],
  phone:     [{ required: true, message: "Phone number is required" }],
  password:  [{ required: true, message: "Password is required" }, { minLength: 8, message: "At least 8 characters" }],
};

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "", email: "", phone: "", password: "",
  });
  const [errors, setErrors]         = useState({});
  const [apiError, setApiError]     = useState("");
  const [success, setSuccess]       = useState("");
  const [loading, setLoading]       = useState(false);

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
      await authService.register(formData);
      setSuccess("Account created! Please sign in.");
      setTimeout(() => navigate("/auth/sign-in"), 2000);
    } catch (err) {
      const detail = err.response?.data;
      if (typeof detail === "object") {
        // Field-level errors from DRF
        const fieldErrors = {};
        Object.entries(detail).forEach(([key, val]) => {
          fieldErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(fieldErrors);
      } else {
        setApiError(detail?.detail ?? "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      {/* Header */}
      <div className="mb-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdPersonAdd className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">Create account</h1>
        <p className="mt-1 text-sm text-slate-400">Join the PFM community portal.</p>
      </div>

      <AlertBanner message={apiError} />
      <AlertBanner message={success} variant="success" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <InputField
          label="Full Name" field="full_name"
          placeholder="Ahmad Faris bin Abdullah"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.full_name}
        />
        <InputField
          label="Email Address" field="email" type="email"
          placeholder="you@example.com"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.email}
        />
        <InputField
          label="Phone Number" field="phone"
          placeholder="+60123456789"
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={RULES.phone}
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
    </div>
  );
}
