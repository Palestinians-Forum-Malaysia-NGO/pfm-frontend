import React from "react";

const DangerButton = ({ onClick, disabled, loading, text = "Delete", icon, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex min-w-0 max-w-full items-center justify-center gap-2
      rounded-full border border-red-300 bg-white px-4 py-2
      text-sm font-medium text-red-500
      transition-all duration-200 ease-in-out
      enabled:hover:-translate-y-px enabled:hover:border-red-400 enabled:hover:bg-red-50 enabled:active:translate-y-0 enabled:active:bg-red-100 enabled:active:scale-[0.98]
      disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none
      ${className}
    `}
  >
    {loading ? (
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent" />
    ) : (
      icon && <span className="shrink-0 flex items-center">{icon}</span>
    )}
    {text && <span className="truncate">{text}</span>}
  </button>
);

export default DangerButton;
