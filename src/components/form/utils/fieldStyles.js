export const WRAPPER   = "mb-4";
export const LABEL     = "mb-1.5 block text-sm font-medium text-slate-900";
export const LABEL_DARK = "mb-1.5 block text-sm font-medium text-slate-400";
export const ERROR_MSG = "mt-1.5 text-xs text-red-500";

export const inputCls = (hasError) =>
  `h-12 w-full rounded-xl border px-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 ${
    hasError
      ? "border-red-400 bg-red-50 focus:border-red-400"
      : "border-slate-200 bg-slate-50 focus:border-green focus:bg-slate-100/70"
  }`;

export const dropdownTriggerCls = (isOpen, hasError) =>
  `flex h-12 w-full cursor-pointer items-center justify-between rounded-xl border px-3 text-sm outline-none transition-all ${
    isOpen
      ? "border-green bg-white"
      : hasError
      ? "border-red-400 bg-red-50"
      : "border-slate-200 bg-slate-50 hover:border-slate-300"
  }`;

export const dropdownPanelCls =
  "absolute z-[9999] mt-1 rounded-xl border border-slate-100 bg-white p-2 shadow-lg shadow-slate-200/40";

export const dropdownSearchCls =
  "mb-2 h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm outline-none transition-all focus:border-green focus:bg-slate-100/70 placeholder:text-slate-400";
