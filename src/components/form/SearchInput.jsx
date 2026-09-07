import React from "react";
import { MdSearch, MdClose } from "react-icons/md";

const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => (
  <div className={`relative ${className}`}>
    <MdSearch className="absolute ltr:left-3 rtl:right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 ltr:pl-9 ltr:pr-8 rtl:pr-9 rtl:pl-8 text-sm text-start text-slate-700 outline-none transition-all duration-200 ease-in-out placeholder:text-slate-400 focus:border-green focus:bg-slate-100/70"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute ltr:right-3 rtl:left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-all duration-200 ease-in-out hover:text-slate-600"
      >
        <MdClose className="h-3.5 w-3.5" />
      </button>
    )}
  </div>
);

export default SearchInput;
