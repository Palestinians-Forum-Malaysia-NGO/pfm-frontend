import React, { useState, useRef, useEffect, useMemo } from "react";
import { MdExpandMore } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[\.\[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const MultiSelect = ({
  label, field, options = [], required = true,
  formData, errors, updateFormData,
  placeholder = "Select...", disabledOptions = []
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValues = getNestedValue(formData, field) ?? [];
  const selectedLabels = options.filter((opt) => selectedValues.includes(opt.value)).map((opt) => opt.label);
  const error = getNestedValue(errors, field);

  const filteredOptions = useMemo(() =>
    options.filter((opt) => opt.label?.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false); setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (option) => {
    if (disabledOptions.includes(option.value)) return;
    const newValues = selectedValues.includes(option.value)
      ? selectedValues.filter((v) => v !== option.value)
      : [...selectedValues, option.value];
    updateFormData(field, newValues);
  };

  return (
    <div className="relative mb-4" ref={containerRef}>
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen((p) => !p)}
        className={`flex min-h-12 w-full cursor-pointer items-center justify-between rounded-xl border px-3 py-2 text-sm outline-none transition-all ${
          isOpen ? "border-green bg-white"
          : error ? "border-red-400 bg-red-50"
          : "border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
      >
        <span className={selectedLabels.length ? "text-slate-900" : "text-slate-400"}>
          {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
        </span>
        <MdExpandMore className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div
          className="absolute z-[9999] mt-1 rounded-xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-200/40"
          style={{ width: containerRef.current?.offsetWidth ?? "100%" }}
        >
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none focus:border-green focus:bg-slate-100/70 placeholder:text-slate-400"
          />
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.map((opt) => {
              const disabled = disabledOptions.includes(opt.value);
              const checked = selectedValues.includes(opt.value);
              return (
                <li
                  key={opt.value}
                  onClick={() => !disabled && handleSelect(opt)}
                  className={`flex h-9 items-center gap-2.5 rounded-lg px-3 text-sm transition-colors ${
                    disabled ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-slate-900 hover:bg-green/10"
                  }`}
                >
                  <input type="checkbox" checked={checked} readOnly className="accent-green h-3.5 w-3.5 shrink-0" />
                  {opt.label}
                </li>
              );
            })}
            {!filteredOptions.length && (
              <p className="px-3 py-3 text-center text-sm text-slate-400">No results found</p>
            )}
          </ul>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default MultiSelect;
