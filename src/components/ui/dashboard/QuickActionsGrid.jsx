import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * Row of navigation shortcuts for a dashboard.
 * actions: [{ label, icon, to }]
 */
export default function QuickActionsGrid({ actions }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {actions.map((a) => (
        <button
          key={a.label}
          onClick={() => navigate(a.to)}
          className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-green/30 hover:shadow-sm active:translate-y-0 active:scale-[0.98]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green/10 text-green transition-colors group-hover:bg-green/15">
            {a.icon}
          </div>
          <span className="text-xs font-semibold text-slate-700">{a.label}</span>
        </button>
      ))}
    </div>
  );
}
