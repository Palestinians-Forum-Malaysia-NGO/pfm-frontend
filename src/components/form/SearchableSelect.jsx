import React, { useState, useRef, useEffect, useMemo } from "react";
import { MdExpandMore } from "react-icons/md";
import { validate } from "./utils/validation";
import { WRAPPER, LABEL, ERROR_MSG, dropdownTriggerCls, dropdownPanelCls, dropdownSearchCls } from "./utils/fieldStyles";

const getNestedValue = (obj, path) => {
  if (!path) return undefined;
  return path.split(/[.[\]]/).filter(Boolean)
    .reduce((acc, key) => (acc ? acc[key] : undefined), obj);
};

const SearchableSelect = ({
  label, field, options = [], required = true,
  formData, errors, updateFormData,
  placeholder = "Select...", actions = [], rules = [],
}) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [localError, setLocalError] = useState(null);

  const selectedValue = getNestedValue(formData, field) ?? "";
  const selectedOption = options.find((opt) => opt.value === selectedValue);
  const selectedLabel = selectedOption?.label ?? selectedValue ?? "";
  const externalError = getNestedValue(errors, field);
  const displayError = localError || externalError;

  const filteredOptions = useMemo(() =>
    options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase())),
    [search, options]
  );

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (isOpen) {
          setLocalError(validate(selectedValue, rules));
        }
        setIsOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, selectedValue, rules]);

  const handleSelect = (option) => {
    updateFormData(field, option.value);
    setLocalError(validate(option.value, rules));
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className={`relative ${WRAPPER}`} ref={containerRef}>
      <label className={LABEL}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={dropdownTriggerCls(isOpen, !!displayError)}
      >
        <span className={selectedLabel ? "text-slate-900" : "text-slate-400"}>
          {selectedLabel || placeholder}
        </span>
        <MdExpandMore className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
          <ul className="max-h-52 overflow-y-auto">
            {filteredOptions.map((opt) => (
              <li
                key={opt.value}
                onClick={() => handleSelect(opt)}
                className="flex h-9 cursor-pointer items-center rounded-lg px-3 text-sm text-slate-900 hover:bg-green/10"
              >
                {opt.label}
              </li>
            ))}

            {!filteredOptions.length && actions.length > 0 && (
              <div className="mt-1 border-t border-slate-100 pt-2">
                <p className="px-3 py-1.5 text-xs text-slate-400">No results found</p>
                {actions.map((action, i) => (
                  <li
                    key={i}
                    onClick={(e) => { e.stopPropagation(); action.onClick?.(); setIsOpen(false); setSearch(""); }}
                    className="flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm text-slate-900 hover:bg-green/10"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </li>
                ))}
              </div>
            )}

            {!filteredOptions.length && !actions.length && (
              <p className="px-3 py-3 text-center text-sm text-slate-400">No results found</p>
            )}
          </ul>
        </div>
      )}

      {displayError && <p className={ERROR_MSG}>{displayError}</p>}
    </div>
  );
};

export default SearchableSelect;
