import React, { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

/**
 * Props:
 *   value    – selected value
 *   onChange – (value: string) => void
 *   options  – { value, label }[]
 *   icon     – ReactNode shown on the left (optional)
 *   disabled – boolean
 *   className – string
 */
const FilterSelect = ({ value, onChange, options, icon, disabled = false, className = "" }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>

      {/* Left icon */}
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
          {icon}
        </span>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className={`
          w-full cursor-pointer appearance-none
          rounded-full border border-slate-200 bg-white
          ${icon ? "pl-9" : "pl-5"} pr-9 py-2.5
          text-sm font-medium text-slate-700
          transition-all duration-200 ease-in-out
          outline-none focus:border-green
          disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
        `}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      {/* Right chevron — rotates when open */}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
        <MdKeyboardArrowDown
          className={`h-4 w-4 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        />
      </span>

    </div>
  );
};

export default FilterSelect;
