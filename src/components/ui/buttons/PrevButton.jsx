import React from "react";
import { MdArrowBack } from "react-icons/md";

const PrevButton = ({ onClick, disabled, text = "Back", icon, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={`
      inline-flex min-w-0 max-w-full items-center justify-center gap-2
      rounded-xl border border-slate-200 bg-white px-4 py-2.5
      text-sm font-medium text-slate-500
      transition-all duration-200 ease-in-out
      hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100 active:scale-[0.97]
      disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none
      ${className}
    `}
  >
    <span className="shrink-0 flex items-center">
      {icon ?? <MdArrowBack className="h-4 w-4" />}
    </span>
    {text && <span className="truncate">{text}</span>}
  </button>
);

export default PrevButton;
