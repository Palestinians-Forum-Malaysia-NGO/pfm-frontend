import React from "react";

const CancelButton = ({ onClick, disabled, text = "Cancel", icon, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex min-w-0 max-w-full items-center justify-center gap-2
      rounded-full border border-slate-200 bg-slate-50 px-4 py-2
      text-sm font-medium text-slate-500
      transition-all duration-200 ease-in-out
      enabled:hover:-translate-y-px enabled:hover:border-slate-300 enabled:hover:bg-slate-100/50 enabled:active:translate-y-0 enabled:active:bg-slate-100 enabled:active:scale-[0.98]
      disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none
      ${className}
    `}
  >
    {icon && <span className="shrink-0 flex items-center">{icon}</span>}
    {text && <span className="truncate">{text}</span>}
  </button>
);

export default CancelButton;
