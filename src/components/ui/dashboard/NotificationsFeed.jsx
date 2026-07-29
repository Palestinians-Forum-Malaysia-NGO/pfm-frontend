import React from "react";
import { MdNotificationsNone } from "react-icons/md";

const TYPE_DOT = {
  approved: "bg-green",
  rejected: "bg-red-400",
  pending:  "bg-amber-400",
  info:     "bg-slate-300",
};

/**
 * Generic feed list — reused for both "Recent Activities" and "Notifications"
 * sections since their row markup is identical, only the items differ.
 * items: [{ id, message, time?, type? }]
 */
export default function NotificationsFeed({ items, loading, emptyText }) {
  if (loading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-slate-100" />)}
      </div>
    );
  }

  if (!items?.length) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <MdNotificationsNone className="h-5 w-5" />
        </div>
        <p className="text-sm text-slate-400">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((n) => (
        <div key={n.id} className="flex items-start gap-3 rounded-xl p-2 transition-colors duration-150 hover:bg-slate-50/60">
          <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[n.type] ?? TYPE_DOT.info}`} />
          <div className="min-w-0">
            <p className="text-sm font-medium text-slate-700">{n.message}</p>
            {n.time && <p className="text-xs text-slate-400">{n.time}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
