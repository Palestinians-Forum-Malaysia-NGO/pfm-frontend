import React from "react";

const variants = {
  primary:   "bg-green text-white border-green enabled:hover:bg-[#006833] enabled:hover:border-[#006833] enabled:active:bg-[#005629]",
  secondary: "bg-slate-50 text-green border-green enabled:hover:bg-green/10 enabled:active:bg-green/20",
  ghost:     "bg-slate-50 text-slate-500 border-slate-200 enabled:hover:border-slate-300 enabled:hover:bg-slate-100/50 enabled:active:bg-slate-100",
  danger:    "bg-white text-red-500 border-red-300 enabled:hover:bg-red-50 enabled:hover:border-red-400 enabled:active:bg-red-100",
};

const Button = ({
  onClick,
  disabled,
  loading,
  icon,
  text,
  type = "button",
  variant = "primary",
  className = "",
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`
        inline-flex min-w-0 max-w-full items-center justify-center gap-2
        rounded-full border px-5 py-2.5 text-sm font-medium
        transition-all duration-200 ease-in-out
        enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none
        ${variants[variant]} ${className}
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
};

export default Button;
