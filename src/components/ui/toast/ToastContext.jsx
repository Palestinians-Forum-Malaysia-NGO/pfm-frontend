import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

let _id = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(({ type = "info", title, message, duration = type === "error" ? 7000 : 4000 }) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    if (duration > 0) setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience shortcuts
  const success = useCallback((title, message, opts) => toast({ type: "success", title, message, ...opts }), [toast]);
  const error   = useCallback((title, message, opts) => toast({ type: "error",   title, message, ...opts }), [toast]);
  const warning = useCallback((title, message, opts) => toast({ type: "warning", title, message, ...opts }), [toast]);
  const info    = useCallback((title, message, opts) => toast({ type: "info",    title, message, ...opts }), [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

/* ── Container ── */
const ToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

/* ── Single toast ── */
const STYLES = {
  success: { bar: "bg-green",         icon: "✓", iconBg: "bg-green/10 text-green" },
  error:   { bar: "bg-red-500",       icon: "✕", iconBg: "bg-red-50 text-red-500" },
  warning: { bar: "bg-amber-400",     icon: "!", iconBg: "bg-amber-50 text-amber-500" },
  info:    { bar: "bg-blue-500",      icon: "i", iconBg: "bg-blue-50 text-blue-500" },
};

const ToastItem = ({ toast, onDismiss }) => {
  const s = STYLES[toast.type] ?? STYLES.info;

  return (
    <div className="pointer-events-auto flex w-[320px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 animate-slide-in">
      {/* Left colour bar */}
      <div className={`w-1 shrink-0 ${s.bar}`} />

      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        {/* Icon */}
        <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black ${s.iconBg}`}>
          {s.icon}
        </span>

        {/* Text */}
        <div className="min-w-0 flex-1">
          {toast.title   && <p className="text-sm font-semibold text-slate-900">{toast.title}</p>}
          {toast.message && <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{toast.message}</p>}
        </div>

        {/* Dismiss */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-1 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-slate-100 hover:text-slate-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
