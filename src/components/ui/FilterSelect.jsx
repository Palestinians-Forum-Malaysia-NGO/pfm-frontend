import React from "react";

const FilterSelect = ({ value, onChange, options, className = "" }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`h-9 cursor-pointer rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-green ${className}`}
  >
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default FilterSelect;
