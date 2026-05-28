import React, { useState } from "react";
import { MdSearch } from "react-icons/md";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, ERROR_MSG } from "./utils/fieldStyles";

const CheckSimpleBoxGroup = ({
  label, field, options, formData,
  updateFormData, errors, required = false, rules = [],
}) => {
  const [search, setSearch] = useState("");
  const [localError, setLocalError] = useState(null);

  const externalError = errors?.[field];
  const displayError = localError || externalError;

  const isSelected = (id) => (formData[field] || []).includes(id);

  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (id) => {
    const selected = formData[field] || [];
    const next = selected.includes(id)
      ? selected.filter((i) => i !== id)
      : [...selected, id];
    updateFormData(field, next);
    setLocalError(validate(next, rules));
  };

  return (
    <div className={WRAPPER}>
      <div className="w-full space-y-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <label className={LABEL}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {filteredOptions.length > 0 && (
            <span className="text-xs text-slate-400">
              {filteredOptions.filter((o) => isSelected(o.id)).length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition-all focus:border-green focus:bg-slate-100/70 placeholder:text-slate-400"
            />
          </div>
          {search && (
            <button type="button" onClick={() => setSearch("")} className="text-xs text-slate-400 hover:text-slate-600">
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pb-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const selected = isSelected(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                    selected
                      ? "border-green bg-green/10 text-[#006833]"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => toggleSelection(option.id)}
                    className="accent-green h-3.5 w-3.5"
                  />
                  {option.name}
                </label>
              );
            })
          ) : (
            <p className="w-full py-4 text-center text-sm text-slate-400">No results found</p>
          )}
        </div>
      </div>

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default CheckSimpleBoxGroup;
