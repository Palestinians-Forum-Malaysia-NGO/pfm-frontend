import React from "react";
import { useTranslation } from "react-i18next";
import { MdBadge, MdFolderSpecial, MdFactCheck, MdPeople } from "react-icons/md";
import { useGetStats } from "components/features/stats/hooks";
import StatCard from "./StatCard";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export default function OrgStatsOverview() {
  const { t } = useTranslation();
  const { stats, loading } = useGetStats();

  const staffTotal   = stats?.staff?.total ?? 0;
  const projects     = stats?.projects ?? {};
  const applications = stats?.applications ?? {};

  const CARDS = [
    { label: t("admin_dashboard.stat_staff"),                value: loading ? "—" : staffTotal,                              icon: MdBadge,         iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
    { label: t("admin_dashboard.stat_projects"),             value: loading ? "—" : (projects.total ?? 0),                   icon: MdFolderSpecial, iconBg: "bg-amber-50",  iconColor: "text-amber-500" },
    { label: t("admin_dashboard.stat_applications"),         value: loading ? "—" : (applications.total ?? 0),               icon: MdFactCheck,     iconBg: "bg-green/10",  iconColor: "text-green" },
    { label: t("admin_dashboard.stat_beneficiaries_helped"), value: loading ? "—" : (projects.total_beneficiaries_helped ?? 0), icon: MdPeople,      iconBg: "bg-pfmRed-50", iconColor: "text-pfmRed-500" },
  ];

  const projectStatusEntries     = Object.entries(projects.by_status ?? {});
  const applicationStatusEntries = Object.entries(applications.by_status ?? {});

  const target = parseFloat(projects.total_target) || 0;
  const spent  = parseFloat(projects.total_amount_spent) || 0;
  const pct    = target > 0 ? Math.min(100, Math.round((spent / target) * 100)) : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold text-slate-500">{t("admin_dashboard.projects_by_status")}</p>
            <div className="flex flex-col gap-2">
              {projectStatusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t(`stats.status_${status}`, { defaultValue: status })}</span>
                  <span className="font-bold text-navy-700">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold text-slate-500">{t("admin_dashboard.applications_by_status")}</p>
            <div className="flex flex-col gap-2">
              {applicationStatusEntries.map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">{t(`applications.status_${status}`, { defaultValue: status })}</span>
                  <span className="font-bold text-navy-700">{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold text-slate-500">{t("admin_dashboard.funding_overview")}</p>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>{fmtMYR(projects.total_amount_spent)}</span>
              <span className="font-bold text-green">{pct}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-green transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">{t("admin_dashboard.of_target", { target: fmtMYR(projects.total_target) })}</p>
          </div>
        </div>
      )}
    </div>
  );
}
