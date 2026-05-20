import React, { useState, useRef, useEffect, useMemo } from "react";
import { MdExpandMore } from "react-icons/md";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[\.\[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const SearchableDropdown = ({
  label, field, options = [], required = true,
  formData, errors, updateFormData,
  placeholder = "Select...", disabledOptions = []
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedValue = getNestedValue(formData, field) ?? "";
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? selectedValue ?? "";
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
    updateFormData(field, option.value);
    setIsOpen(false); setSearch("");
  };

  return (
    <div className="relative mb-4" ref={containerRef}>
      <label className="mb-1.5 block text-sm font-medium text-slate-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen((p) => !p)}
        className={`flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border px-3 text-sm outline-none transition-all ${
          isOpen ? "border-green bg-white"
          : error ? "border-red-400 bg-red-50"
          : "border-slate-200 bg-slate-50 hover:border-slate-300"
        }`}
      >
        <span className={selectedLabel ? "text-slate-900" : "text-slate-400"}>
          {selectedLabel || placeholder}
        </span>
        <MdExpandMore className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
              return (
                <li
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  className={`flex h-9 items-center rounded-lg px-3 text-sm transition-colors ${
                    disabled ? "cursor-not-allowed text-slate-300" : "cursor-pointer text-slate-900 hover:bg-green/10"
                  }`}
                >
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

export default SearchableDropdown;
