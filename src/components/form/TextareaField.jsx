import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const TextareaField = ({ label, field, rows = 4, required = true, placeholder = "", formData, errors, updateFormData }) => {
  const value = getNestedValue(formData, field) ?? "";
  const error = getNestedValue(errors, field);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        placeholder={placeholder}
        className={`w-full resize-none rounded-xl border px-3 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:outline-none ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
        }`}
      />

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default TextareaField;
