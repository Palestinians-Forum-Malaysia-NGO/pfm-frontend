import React, { useState } from "react";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, LABEL_DARK, ERROR_MSG, inputCls } from "./utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const InputField = ({
  label, field, type = "text", required = true,
  placeholder = "", formData, errors, updateFormData,
  variant = "default", rules = [],
}) => {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState(null);

  const value = getNestedValue(formData, field) ?? "";
  const externalError = getNestedValue(errors, field);
  const displayError = localError || externalError;

  const dateProps = type === "date" ? { min: "1900-01-01", max: "2099-12-31" } : {};

  const handleChange = (e) => {
    const next = type === "email" ? e.target.value.toLowerCase() : e.target.value;
    updateFormData(field, next);
    if (touched) setLocalError(validate(next, rules));
  };

  const handleBlur = () => {
    setTouched(true);
    setLocalError(validate(value, rules));
  };

  const fieldCls = variant === "dark"
    ? `h-10 w-full border-b bg-transparent px-0 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:outline-none ${
        displayError ? "border-red-400" : "border-slate-600 focus:border-green/75"
      }`
    : inputCls(!!displayError);

  return (
    <div className={WRAPPER}>
      {label && (
        <label className={variant === "dark" ? LABEL_DARK : LABEL}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        {...dateProps}
        className={fieldCls}
      />
      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default InputField;
