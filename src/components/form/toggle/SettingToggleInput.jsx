import React from "react";

const SettingToggleInput = ({ label, field, formData, updateFormData, errors }) => {
  const selected = Boolean(
    field.split(".").reduce((acc, key) => acc?.[key], formData)
  );

  return (
    <div className="mb-4">
      <label
        onClick={() => updateFormData(field, !selected)}
        className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all duration-200 ${
          selected
            ? "border-green bg-green/10"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-900">{label}</span>
          <span className="mt-0.5 text-xs text-slate-400">Click to toggle</span>
        </div>
        <div className={`relative h-6 w-11 shrink-0 rounded-full transition-all duration-200 ${selected ? "bg-green" : "bg-slate-200"}`}>
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${selected ? "translate-x-5" : "translate-x-0.5"}`} />
        </div>
      </label>

      {errors?.[field] && <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>}
    </div>
  );
};

export default SettingToggleInput;
