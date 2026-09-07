import React, { useState } from "react";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, ERROR_MSG } from "./utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const TextareaField = ({
  label, field, rows = 4, required = true,
  placeholder = "", formData, errors, updateFormData, rules = [],
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState(null);

  const value = getNestedValue(formData, field) ?? "";
  const externalError = getNestedValue(errors, field);
  const displayError = localError || externalError;

  const handleChange = (e) => {
    updateFormData(field, e.target.value);
    if (touched) setLocalError(validate(e.target.value, rules));
  };

  const handleBlur = () => {
    setTouched(true);
    setLocalError(validate(value, rules));
  };

  return (
    <div className={WRAPPER}>
      <label className={LABEL}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <textarea
        rows={rows}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full resize-none rounded-xl border px-3 py-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
          displayError
            ? "border-red-400 bg-red-50 focus:border-red-400"
            : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
        }`}
      />

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default TextareaField;
