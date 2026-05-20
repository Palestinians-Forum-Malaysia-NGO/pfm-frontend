import React from "react";

const ToggleInput = ({ label, field, formData, updateFormData, errors, required = false }) => {
  const selected = Boolean(formData[field]);

  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <label
        className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition-all ${
          selected
            ? "border-green bg-green/10"
            : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
        }`}
      >
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-900">{selected ? "Enabled" : "Disabled"}</span>
          <span className="text-xs text-slate-400">Click to toggle</span>
        </div>
        <div className="relative">
          <input type="checkbox" checked={selected} onChange={() => updateFormData(field, !selected)} className="peer sr-only" />
          <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-green" />
          <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
        </div>
      </label>

      {errors?.[field] && <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>}
    </div>
  );
};

export default ToggleInput;
