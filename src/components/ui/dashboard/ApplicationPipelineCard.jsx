import React from "react";
import { useTranslation } from "react-i18next";
import { MdFactCheck, MdPending, MdCheckCircle, MdCancel, MdFolderSpecial } from "react-icons/md";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";

/**
 * mode="aggregate" — 4 clickable status-count chips (admin/staff, org-wide view).
 *   props: { stats: {total,pending,approved,rejected}, loading, onStatusClick }
 * mode="single"    — a beneficiary's own applications, one row each (no counts).
 *   props: { applications: [{id, project:{title}, status}], loading, emptyText }
 */
export default function ApplicationPipelineCard({
  mode = "aggregate", stats, loading, onStatusClick, applications, emptyText,
}) {
  const { t } = useTranslation();

  if (mode === "single") {
    if (loading) {
      return (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      );
    }
    if (!applications?.length) {
      return <p className="py-6 text-center text-sm text-slate-400">{emptyText}</p>;
    }
    return (
      <div className="flex flex-col divide-y divide-slate-100">
        {applications.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green/10 text-green">
                <MdFolderSpecial className="h-4 w-4" />
              </div>
              <p className="truncate text-sm font-medium text-slate-700">{a.project?.title ?? "—"}</p>
            </div>
            <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${APPLICATION_STATUS_BADGE[a.status] ?? "bg-slate-100 text-slate-500"}`}>
              {t(`applications.status_${a.status}`, { defaultValue: a.status })}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const CARDS = [
    { key: "total",    label: t("applications.total"),           value: stats?.total ?? 0,    icon: <MdFactCheck className="h-4 w-4" />,   color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",  label: t("applications.status_pending"),  value: stats?.pending ?? 0,  icon: <MdPending className="h-4 w-4" />,     color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "approved", label: t("applications.status_approved"), value: stats?.approved ?? 0, icon: <MdCheckCircle className="h-4 w-4" />, color: "text-green",     bgColor: "bg-green/10" },
    { key: "rejected", label: t("applications.status_rejected"), value: stats?.rejected ?? 0, icon: <MdCancel className="h-4 w-4" />,      color: "text-red-500",   bgColor: "bg-red-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {CARDS.map((c) => (
        <button
          key={c.key}
          onClick={() => onStatusClick?.(c.key)}
          className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-start transition-all duration-200 ease-in-out hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 active:translate-y-0 active:scale-[0.98]"
        >
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.bgColor} ${c.color}`}>{c.icon}</div>
          <div className="min-w-0 flex-1">
            <p className="text-xl font-bold leading-none text-slate-900">{loading ? "—" : c.value}</p>
            <p className="mt-0.5 truncate text-xs text-slate-400">{c.label}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
