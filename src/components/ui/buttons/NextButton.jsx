import React from "react";
import { MdArrowForward } from "react-icons/md";

const NextButton = ({ onClick, disabled, loading, text = "Next", icon, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex min-w-0 max-w-full items-center justify-center gap-2
      rounded-xl border border-green bg-white px-4 py-2.5
      text-sm font-medium text-green
      transition-all duration-200 ease-in-out
      hover:bg-green/10 active:bg-green/15 active:scale-[0.97]
      disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
      ${className}
    `}
  >
    {loading ? (
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-green border-t-transparent" />
    ) : (
      <>
        {text && <span className="truncate">{text}</span>}
        <span className="shrink-0 flex items-center">
          {icon ?? <MdArrowForward className="h-4 w-4" />}
        </span>
      </>
    )}
  </button>
);

export default NextButton;
