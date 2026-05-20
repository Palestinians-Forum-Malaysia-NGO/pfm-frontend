import React from "react";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path
    .split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const RadioField = ({ label, field, options, formData, errors, updateFormData, required = true }) => {
  const value = getNestedValue(formData, field);
  const error = getNestedValue(errors, field);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2">
        {options.map((opt) => (
          <label
            key={opt.label}
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
              error ? "border-red-400" : ""
            } ${
              value === opt.value
                ? "border-green bg-green/10 text-[#006833]"
                : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300 hover:bg-white"
            }`}
          >
            <input
              type="radio"
              name={field}
              value={opt.value}
              checked={value === opt.value}
              onChange={() => updateFormData(field, opt.value)}
              className="hidden"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default RadioField;
