import React from "react";

const IconButton = ({
  onClick,
  disabled,
  loading,
  icon,
  bgColor = "bg-white",
  textColor = "text-green",
  borderColor = "border-green",
  hoverTextColor = "hover:text-green/75",
  hoverBorderColor = "hover:border-[#006833]",
  text,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex min-w-0 max-w-full items-center justify-center gap-1.5
        rounded-xl border px-3 py-2 text-sm font-medium
        transition-all duration-200 ease-in-out
        active:scale-[0.97]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
        ${bgColor} ${textColor} ${borderColor} ${hoverTextColor} ${hoverBorderColor} ${className}
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

export default IconButton;
