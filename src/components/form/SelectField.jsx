import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const SelectField = ({ label, field, options, required = true, formData, errors, updateFormData }) => {
  const value = getNestedValue(formData, field) ?? "";
  const error = getNestedValue(errors, field);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => updateFormData(field, e.target.value)}
        className={`h-12 w-full cursor-pointer rounded-xl border px-3 text-sm text-slate-900 outline-none transition-all focus:outline-none ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
        }`}
      >
        <option value="" className="text-slate-400">Select ...</option>
        {options.map((opt, index) =>
          typeof opt === "object" && opt !== null ? (
            <option key={opt.value ?? index} value={opt.value ?? ""}>
              {opt.label ?? opt.value ?? ""}
            </option>
          ) : (
            <option key={opt + index} value={opt}>{opt}</option>
          )
        )}
      </select>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
