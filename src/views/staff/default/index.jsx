import React from "react";
import { useTranslation } from "react-i18next";
import { MdFolderSpecial, MdPeople, MdAttachMoney, MdFactCheck } from "react-icons/md";
import { useGetStats } from "components/features/stats/hooks";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const StaffDashboard = () => {
  const { t } = useTranslation();
  const { stats, loading } = useGetStats();

  const projects     = stats?.projects ?? {};
  const applications = stats?.applications ?? {};

  const CARDS = [
    { label: t("staff_dashboard.stat_projects"),             value: loading ? "—" : (projects.total ?? 0),              icon: <MdFolderSpecial className="h-6 w-6" />, bg: "bg-green/10",  color: "text-green" },
    { label: t("staff_dashboard.stat_beneficiaries_helped"), value: loading ? "—" : (stats?.beneficiaries_helped ?? 0), icon: <MdPeople        className="h-6 w-6" />, bg: "bg-blue-50",   color: "text-blue-500" },
    { label: t("staff_dashboard.stat_amount_spent"),         value: loading ? "—" : fmtMYR(stats?.amount_spent),        icon: <MdAttachMoney   className="h-6 w-6" />, bg: "bg-pfmRed-50", color: "text-pfmRed-500" },
    { label: t("staff_dashboard.stat_applications"),         value: loading ? "—" : (applications.total ?? 0),         icon: <MdFactCheck     className="h-6 w-6" />, bg: "bg-amber-50",  color: "text-amber-500" },
  ];

  const projectStatusEntries     = Object.entries(projects.by_status ?? {});
  const applicationStatusEntries = Object.entries(applications.by_status ?? {});

  return (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-xl font-bold text-navy-700">{t("staff_dashboard.title")}</h1>
      <p className="mt-1 text-sm text-gray-400">{t("staff_dashboard.subtitle")}</p>
    </div>

    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map((c) => (
        <div key={c.label} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
            {c.icon}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400">{c.label}</p>
            <p className="text-2xl font-bold text-navy-700">{c.value}</p>
          </div>
        </div>
      ))}
    </div>

    {!loading && (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold text-gray-500">{t("staff_dashboard.projects_by_status")}</p>
          <div className="flex flex-col gap-2">
            {projectStatusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t(`stats.status_${status}`, { defaultValue: status })}</span>
                <span className="font-bold text-navy-700">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold text-gray-500">{t("staff_dashboard.applications_by_status")}</p>
          <div className="flex flex-col gap-2">
            {applicationStatusEntries.map(([status, count]) => (
              <div key={status} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{t(`applications.status_${status}`, { defaultValue: status })}</span>
                <span className="font-bold text-navy-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default StaffDashboard;
