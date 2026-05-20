import React, { useEffect } from "react";
import { MdDeleteOutline, MdAddCircle } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[\.\[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const ArrayObjectField = ({ label, subLabel, field, formData, errors, updateFormData, fields = [], getDefaultRow }) => {
  const arrayValue = getNestedValue(formData, field) || [];

  const buildDefaultRow = (currentArray) => {
    if (getDefaultRow) return getDefaultRow(currentArray);
    return fields.reduce((acc, f) => { acc[f.key] = ""; return acc; }, {});
  };

  useEffect(() => {
    if (!arrayValue || arrayValue.length === 0) updateFormData(field, [buildDefaultRow([])]);
  }, []);

  const handleChange = (index, key, value) => {
    const newArray = [...arrayValue];
    newArray[index] = { ...newArray[index], [key]: value };
    updateFormData(field, newArray);
  };

  const addRow = () => updateFormData(field, [...arrayValue, buildDefaultRow(arrayValue)]);

  const removeRow = (index) => {
    if (arrayValue.length <= 1) return;
    updateFormData(field, arrayValue.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-900">{label}</label>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1.5 rounded-lg border border-green bg-green/10 px-3 py-1.5 text-xs font-medium text-[#006833] transition-all hover:bg-green/15"
        >
          <MdAddCircle className="h-3.5 w-3.5" />
          Add Row
        </button>
      </div>

      {arrayValue.map((item, index) => (
        <div key={index} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-sm font-medium text-slate-500">{subLabel} {index + 1}</span>
            <button
              type="button"
              onClick={() => removeRow(index)}
              disabled={arrayValue.length <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-all hover:border-red-400 hover:bg-red-50 disabled:opacity-40"
            >
              <MdDeleteOutline className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {fields.map((f) => {
              const errorMsg = getNestedValue(errors, `${field}[${index}].${f.key}`);
              return (
                <div key={f.key}>
                  <label className="mb-1 block text-xs font-medium text-slate-500">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    value={item?.[f.key] ?? ""}
                    placeholder={f.placeholder || ""}
                    onChange={(e) => handleChange(index, f.key, e.target.value)}
                    className={`h-10 w-full rounded-lg border px-3 text-sm text-slate-900 outline-none transition-all focus:border-green focus:bg-slate-100/70 placeholder:text-slate-400 ${
                      errorMsg ? "border-red-400 bg-red-50" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                  {errorMsg && <p className="mt-1 text-xs text-red-500">{errorMsg}</p>}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArrayObjectField;
