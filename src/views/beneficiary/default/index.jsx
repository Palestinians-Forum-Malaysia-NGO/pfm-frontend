import { useTranslation } from "react-i18next";
import {
  MdFactCheck, MdPending, MdCheckCircle, MdCancel,
} from "react-icons/md";

import StatCard    from "views/admin/default/components/StatCard";
import RecentAid   from "./components/RecentAid";
import { useGetStats } from "components/features/stats/hooks";

const BeneficiaryDashboard = () => {
  const { t } = useTranslation();
  const { stats, loading } = useGetStats();

  const applications = stats?.applications ?? {};
  const byStatus = applications.by_status ?? {};

  const STATS = [
    {
      label: t("beneficiary_dashboard.stat_total_applications"),
      value: loading ? "—" : (applications.total ?? 0),
      icon: MdFactCheck,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
    {
      label: t("beneficiary_dashboard.stat_pending"),
      value: loading ? "—" : (byStatus.pending ?? 0),
      icon: MdPending,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-500",
    },
    {
      label: t("beneficiary_dashboard.stat_approved"),
      value: loading ? "—" : (byStatus.approved ?? 0),
      icon: MdCheckCircle,
      iconBg: "bg-green/10",
      iconColor: "text-green",
    },
    {
      label: t("beneficiary_dashboard.stat_rejected"),
      value: loading ? "—" : (byStatus.rejected ?? 0),
      icon: MdCancel,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="flex flex-col gap-4">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Main grid: left (2/3) + right (1/3) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

        {/* Left — recent applications */}
        <div className="lg:col-span-2">
          <RecentAid applications={applications.recent ?? []} loading={loading} />
        </div>

      </div>
    </div>
  );
};

export default BeneficiaryDashboard;
