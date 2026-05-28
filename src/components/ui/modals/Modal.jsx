import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const Modal = ({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
}) => {
  const [visible, setVisible] = useState(false);
  const [shown,   setShown]   = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      // Double rAF: wait for the element to be painted before adding transition classes
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true))
      );
      return () => cancelAnimationFrame(id);
    } else {
      setShown(false);
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-200 ${
        shown ? "bg-black/40" : "bg-black/0"
      }`}
      onClick={closeOnBackdrop ? onClose : undefined}
    >
      <div
        className={`relative w-full ${SIZES[size]} rounded-2xl bg-white shadow-2xl transition-all duration-200 ${
          shown
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-4 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >

        {/* ── Header ── */}
        {(title || icon) && (
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex min-w-0 items-center gap-2.5">
              {icon}
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-slate-900">{title}</h2>
                {subtitle && (
                  <p className="mt-0.5 truncate text-xs text-slate-400">{subtitle}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-600"
            >
              <MdClose className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ── Body ── */}
        <div className="px-5 py-4">{children}</div>

        {/* ── Footer ── */}
        {footer && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4">
            {footer}
          </div>
        )}

      </div>
    </div>
  );
};

export default Modal;
