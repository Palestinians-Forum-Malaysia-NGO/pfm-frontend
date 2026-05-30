import React from "react";
import { MdErrorOutline, MdCheckCircleOutline, MdInfoOutline, MdWarningAmber } from "react-icons/md";

const VARIANTS = {
  error:   { wrapper: "border-red-200 bg-red-50 text-red-600",     icon: <MdErrorOutline className="h-4 w-4 shrink-0" /> },
  success: { wrapper: "border-green/20 bg-green/5 text-green",     icon: <MdCheckCircleOutline className="h-4 w-4 shrink-0" /> },
  warning: { wrapper: "border-amber-200 bg-amber-50 text-amber-600", icon: <MdWarningAmber className="h-4 w-4 shrink-0" /> },
  info:    { wrapper: "border-blue-200 bg-blue-50 text-blue-600",   icon: <MdInfoOutline className="h-4 w-4 shrink-0" /> },
};

/**
 * Inline alert banner for form errors, warnings, and feedback.
 *
 * Props:
 *   message – string | ReactNode  (renders nothing if falsy)
 *   variant – "error" | "success" | "warning" | "info"  (default "error")
 */
const AlertBanner = ({ message, variant = "error" }) => {
  if (!message) return null;
  const { wrapper, icon } = VARIANTS[variant] ?? VARIANTS.error;

  return (
    <div className={`mb-4 flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium ${wrapper}`}>
      {icon}
      <span>{message}</span>
    </div>
  );
};

export default AlertBanner;
