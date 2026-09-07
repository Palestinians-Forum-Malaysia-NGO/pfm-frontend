import React, { useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, ERROR_MSG, inputCls } from "./utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const PasswordField = ({
  label, field, required = true, placeholder = "",
  formData, errors, updateFormData, rules = [],
}) => {
  const [show, setShow] = useState(false);
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

      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`${inputCls(!!displayError)} pr-10`}
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <MdVisibilityOff className="h-4 w-4" /> : <MdVisibility className="h-4 w-4" />}
        </button>
      </div>

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default PasswordField;
