import React from "react";

export default function FilterSelectField({ value, onChange, options = [], icon: Icon = null, defaultOption = "Select ..." }) {
  return (
    <div className="relative flex-1 sm:flex-none">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 outline-none transition-all focus:border-green focus:bg-slate-100/70 ${Icon ? "pl-9 pr-3" : "px-3"}`}
      >
        <option value="all">{defaultOption}</option>
        {options.map((opt) =>
          typeof opt === "object" && opt !== null ? (
            <option key={opt.value ?? opt.id} value={opt.value ?? opt.name}>
              {opt.label ?? opt.name ?? opt.value}
            </option>
          ) : (
            <option key={opt} value={opt}>{opt}</option>
          )
        )}
      </select>
    </div>
  );
}
