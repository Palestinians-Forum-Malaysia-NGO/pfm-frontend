import React from "react";
import { MdArrowForward } from "react-icons/md";
import { useTranslation } from "react-i18next";

const NextButton = ({ onClick, disabled, loading, text, icon, className = "" }) => {
  const { t } = useTranslation();
  const label = text ?? t("common.next");
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex min-w-0 max-w-full items-center justify-center gap-2
        rounded-full border border-green bg-white px-4 py-2
        text-sm font-medium text-green
        transition-all duration-200 ease-in-out
        enabled:hover:-translate-y-px enabled:hover:bg-green/10 enabled:active:translate-y-0 enabled:active:bg-green/15 enabled:active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none
        ${className}
      `}
    >
      {loading ? (
        <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-green border-t-transparent" />
      ) : (
        <>
          {label && <span className="truncate">{label}</span>}
          <span className="shrink-0 flex items-center">
            {icon ?? <MdArrowForward className="h-4 w-4" />}
          </span>
        </>
      )}
    </button>
  );
};

export default NextButton;
