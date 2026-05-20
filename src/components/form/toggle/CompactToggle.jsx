import React from "react";

const CompactToggle = ({ label, description, field, formData, updateFormData }) => {
  const value = formData[field];

  return (
    <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => updateFormData(field, !value)}
        className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-green" : "bg-slate-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
      </button>
    </div>
  );
};

export default CompactToggle;
