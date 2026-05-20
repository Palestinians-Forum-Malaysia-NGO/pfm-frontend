import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/)
    .filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const PasswordField = ({
  label,
  field,
  required = true,
  placeholder = "",
  formData,
  errors,
  updateFormData,
}) => {
  const [show, setShow] = useState(false);
  const value = getNestedValue(formData, field) ?? "";
  const error = getNestedValue(errors, field);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => updateFormData(field, e.target.value)}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border px-3 pr-10 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:outline-none ${
            error
              ? "border-red-400 bg-red-50 focus:border-red-500"
              : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
          }`}
        />
        <button
          type="button"
          onClick={() => setShow((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <MdVisibilityOff className="h-4 w-4" /> : <MdVisibility className="h-4 w-4" />}
        </button>
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default PasswordField;
