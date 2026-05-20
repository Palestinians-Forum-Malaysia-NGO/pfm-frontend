import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const InputField = ({ label, field, type = "text", required = true, placeholder = "", formData, errors, updateFormData, variant = "default" }) => {
  const value = getNestedValue(formData, field) ?? "";
  const error = getNestedValue(errors, field);

  const dateProps = type === "date" ? { min: "1900-01-01", max: "2099-12-31" } : {};

  const inputClass = variant === "dark"
    ? `h-10 w-full border-b bg-transparent px-0 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:outline-none ${
        error ? "border-red-400" : "border-slate-600 focus:border-green/75"
      }`
    : `h-12 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:outline-none ${
        error ? "border-red-400 bg-red-50 focus:border-red-500" : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70/70"
      }`;

  return (
    <div className="mb-4">
      {label && (
        <label className={`mb-1.5 block text-sm font-medium ${variant === "dark" ? "text-slate-400" : "text-slate-900"}`}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => updateFormData(field, type === "email" ? e.target.value.toLowerCase() : e.target.value)}
        placeholder={placeholder}
        {...dateProps}
        className={inputClass}
      />

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
};

export default InputField;
