import React from "react";

const DangerButton = ({ onClick, disabled, loading, text = "Delete", icon, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex min-w-0 max-w-full items-center justify-center gap-2
      rounded-xl border border-red-300 bg-white px-4 py-2.5
      text-sm font-medium text-red-500
      transition-all duration-200 ease-in-out
      hover:border-red-400 hover:bg-red-50 active:bg-red-100 active:scale-[0.97]
      disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
      ${className}
    `}
  >
    {loading ? (
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
    ) : (
      icon && <span className="shrink-0 flex items-center">{icon}</span>
    )}
    {text && <span className="truncate">{text}</span>}
  </button>
);

export default DangerButton;
