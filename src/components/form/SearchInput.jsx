import React from "react";
import { MdSearch, MdClose } from "react-icons/md";

const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`relative ${className}`}>
    <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 py-2 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-green/75 focus:ring-2 focus:ring-green/15"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
      >
        <MdClose className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export default SearchInput;
