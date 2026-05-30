import React, { useState, useRef, useEffect } from "react";
import { MdMoreVert, MdKeyboardArrowDown } from "react-icons/md";

/**
 * Reusable dropdown button.
 *
 * Props:
 *   label    – trigger text                           (default "Actions")
 *   icon     – icon left of label                     (default MdMoreVert)
 *   align    – menu alignment: "left" | "right"       (default "right")
 *   variant  – trigger style: "outline" | "ghost"     (default "outline")
 *   disabled – disables the trigger                   (default false)
 *   items    – array:
 *     { label, icon, onClick, variant: "default"|"danger" }
 *     { divider: true }
 */
const DropdownButton = ({
  label    = "Actions",
  icon,
  align    = "right",
  variant  = "outline",
  disabled = false,
  items    = [],
}) => {
  const [open, setOpen] = useState(false);
  const ref             = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative inline-flex" ref={ref}>

      {/* ── Trigger ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`
          inline-flex min-w-0 max-w-full items-center justify-center gap-2
          rounded-full border px-5 py-2.5 text-sm font-medium
          transition-all duration-200 ease-in-out
          enabled:hover:-translate-y-px enabled:active:translate-y-0 enabled:active:scale-[0.98]
          disabled:cursor-not-allowed disabled:opacity-50 disabled:select-none
          ${
          variant === "ghost"
            ? open
              ? "border-transparent bg-slate-100 text-slate-900"
              : "border-transparent bg-transparent text-slate-600 hover:bg-slate-100"
            : open
            ? "border-slate-300 bg-slate-50 text-slate-900 shadow-sm"
            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
        }`}
      >
        <span className="flex items-center text-slate-400">
          {icon ?? <MdMoreVert className="h-4 w-4" />}
        </span>
        <span>{label}</span>
        <MdKeyboardArrowDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ease-in-out ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Menu ── */}
      {open && (
        <div
          className={`absolute top-[calc(100%+6px)] z-30 min-w-[176px] overflow-hidden rounded-2xl border border-slate-200 bg-white py-1.5 shadow-xl shadow-slate-200/70 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="my-1.5 border-t border-slate-100" />
            ) : (
              <button
                key={i}
                type="button"
                onClick={() => { setOpen(false); item.onClick?.(); }}
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors duration-[250ms] ease-in-out ${
                  item.variant === "danger"
                    ? "text-red-500 hover:bg-red-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {item.icon && (
                  <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                    item.variant === "danger"
                      ? "bg-red-50 text-red-400"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            )
          )}
        </div>
      )}

    </div>
  );
};

export default DropdownButton;
