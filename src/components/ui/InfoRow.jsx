import React from "react";

/**
 * Reusable info display row for detail pages.
 *
 * Props:
 *   icon  – ReactNode shown in the icon box
 *   label – field label (shown uppercase)
 *   value – field value
 */
const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3.5">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200/80">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);

export default InfoRow;
