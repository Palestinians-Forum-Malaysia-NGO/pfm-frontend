import React from "react";

const CheckBoxGroup = ({ label, field, options, formData, updateFormData, errors, required = false }) => {
  const isSelected = (id) => (formData[field] || []).includes(id);

  const toggleSelection = (id) => {
    const selected = formData[field] || [];
    updateFormData(
      field,
      selected.includes(id) ? selected.filter((i) => i !== id) : [...selected, id]
    );
  };

  return (
    <div className="mb-5">
      <label className="mb-2 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => {
          const selected = isSelected(option.id);
          return (
            <label
              key={option.id}
              className={`relative flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3.5 transition-all ${
                selected
                  ? "border-green bg-green/10"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-slate-900">{option.name}</span>
                <span className="text-xs text-slate-400">{selected ? "Enabled" : "Disabled"}</span>
              </div>

              <div className="relative">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleSelection(option.id)}
                  className="peer sr-only"
                />
                <div className="h-6 w-11 rounded-full bg-slate-200 transition-colors peer-checked:bg-green" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          );
        })}
      </div>

      {errors?.[field] && <p className="mt-1.5 text-xs text-red-500">{errors[field]}</p>}
    </div>
  );
};

export default CheckBoxGroup;
