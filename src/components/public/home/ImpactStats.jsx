import React from "react";
import { useTranslation } from "react-i18next";
import { MdFolderSpecial, MdTrendingUp, MdPeople, MdAttachMoney } from "react-icons/md";
import useInView from "hooks/useInView";
import { useGetStats } from "components/features/stats/hooks";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const ImpactStats = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView();
  const { stats, loading } = useGetStats();

  const projects = stats?.projects ?? {};

  const STATS = [
    { icon: <MdFolderSpecial className="h-6 w-6" />, value: loading ? "—" : (projects.total ?? 0),                    label: t("home.stat_projects") },
    { icon: <MdTrendingUp className="h-6 w-6" />,    value: loading ? "—" : (projects.by_status?.active ?? 0),        label: t("home.stat_active_projects") },
    { icon: <MdPeople className="h-6 w-6" />,        value: loading ? "—" : (stats?.total_beneficiaries_helped ?? 0), label: t("home.stat_beneficiaries_helped") },
    { icon: <MdAttachMoney className="h-6 w-6" />,   value: loading ? "—" : fmtMYR(stats?.total_amount_spent),        label: t("home.stat_amount_spent") },
  ];

  return (
    <section ref={ref} className="bg-white py-14">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-2 text-center transition-all duration-700 ease-in-out"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green/10 text-green">
                {s.icon}
              </div>
              <p className="text-3xl font-black text-slate-900">{s.value}</p>
              <p className="text-xs font-medium text-slate-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactStats;
