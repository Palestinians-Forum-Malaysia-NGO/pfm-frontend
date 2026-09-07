import React, { useState, useRef, useEffect, useMemo } from "react";
import { MdExpandMore } from "react-icons/md";
import { validate } from "../utils/validation";
import { WRAPPER, LABEL, ERROR_MSG, dropdownTriggerCls, dropdownPanelCls, dropdownSearchCls } from "../utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const MultiSelect = ({
  label, field, options = [], required = true,
  formData, errors, updateFormData,
  placeholder = "Select...", disabledOptions = [], rules = [],
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localError, setLocalError] = useState(null);

  const selectedValues = getNestedValue(formData, field) ?? [];
  const selectedLabels = options.filter((opt) => selectedValues.includes(opt.value)).map((opt) => opt.label);
  const externalError = getNestedValue(errors, field);
  const displayError = localError || externalError;

  const filteredOptions = useMemo(() =>
    options.filter((opt) => opt.label?.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isOpen) setLocalError(validate(selectedValues, rules));
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, selectedValues, rules]);

  const handleSelect = (option) => {
    if (disabledOptions.includes(option.value)) return;
    const newValues = selectedValues.includes(option.value)
      ? selectedValues.filter((v) => v !== option.value)
      : [...selectedValues, option.value];
    updateFormData(field, newValues);
    setLocalError(validate(newValues, rules));
  };

  return (
    <div className={`relative ${WRAPPER}`} ref={containerRef}>
      <label className={LABEL}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen((p) => !p)}
        className={`${dropdownTriggerCls(isOpen, !!displayError)} min-h-12 h-auto py-2`}
      >
        <span className={selectedLabels.length ? "text-slate-900" : "text-slate-400"}>
          {selectedLabels.length ? selectedLabels.join(", ") : placeholder}
        </span>
        <MdExpandMore className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div className={dropdownPanelCls} style={{ width: containerRef.current?.offsetWidth ?? "100%" }}>
          <input
            type="text"
            placeholder="Search..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={dropdownSearchCls}
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

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default MultiSelect;
