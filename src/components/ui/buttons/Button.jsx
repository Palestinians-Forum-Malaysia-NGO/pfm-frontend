import React from "react";

const variants = {
  primary:   "bg-green text-white border-green hover:bg-[#006833] hover:border-[#006833] active:bg-[#005629]",
  secondary: "bg-white text-green border-green hover:bg-green/10 active:bg-green/20",
  ghost:     "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100",
  danger:    "bg-white text-red-500 border-red-300 hover:bg-red-50 hover:border-red-400 active:bg-red-100",
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
        rounded-full border px-4 py-2.5 text-sm font-medium
        transition-all duration-200 ease-in-out
        active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
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
