import React from "react";
import { MdDeleteOutline, MdAddCircle } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[\.\[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const MultipleDateInput = ({ label, field, required = true, formData, errors, updateFormData }) => {
  const dates = getNestedValue(formData, field) || [];

  React.useEffect(() => {
    if (dates.length === 0) updateFormData(field, [""]);
  }, [dates.length, field, updateFormData]);

  const addDate = () => updateFormData(field, [...dates, ""]);

  const updateDate = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    updateFormData(field, newDates);
  };

  const removeDate = (index) => {
    if (dates.length <= 1) return;
    const newDates = [...dates];
    newDates.splice(index, 1);
    updateFormData(field, newDates);
  };

  return (
    <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <label className="text-sm font-medium text-slate-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          type="button"
          onClick={addDate}
          className="flex items-center gap-1.5 rounded-lg border border-green bg-green/10 px-3 py-1.5 text-xs font-medium text-[#006833] transition-all hover:bg-green/15"
        >
          <MdAddCircle className="h-3.5 w-3.5" />
          Add Date
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {dates.map((date, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => updateDate(i, e.target.value)}
              aria-label={`Date ${i + 1}`}
              className={`h-10 rounded-lg border px-3 text-sm text-slate-900 outline-none transition-all focus:border-green focus:bg-slate-100/70 ${
                getNestedValue(errors, `${field}[${i}]`)
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200 bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => removeDate(i)}
              disabled={dates.length <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 text-red-500 transition-all hover:border-red-400 hover:bg-red-50 disabled:opacity-40"
            >
              <MdDeleteOutline className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {getNestedValue(errors, field) && (
        <p className="mt-2 text-xs text-red-500">{getNestedValue(errors, field)}</p>
      )}
    </div>
  );
};

export default MultipleDateInput;
