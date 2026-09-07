import React, { useState } from "react";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, ERROR_MSG } from "./utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const RadioField = ({
  label, field, options, formData, errors,
  updateFormData, required = true, rules = [],
}) => {
  const [localError, setLocalError] = useState(null);

  const value = getNestedValue(formData, field);
  const externalError = getNestedValue(errors, field);
  const displayError = localError || externalError;

  const handleChange = (optValue) => {
    updateFormData(field, optValue);
    setLocalError(validate(optValue, rules));
  };

  return (
    <div className={WRAPPER}>
      <label className={LABEL}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="flex gap-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
              displayError ? "border-red-400" : ""
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
              onChange={() => handleChange(opt.value)}
              className="hidden"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default RadioField;
