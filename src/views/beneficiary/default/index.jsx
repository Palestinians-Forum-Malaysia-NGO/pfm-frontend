import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdFactCheck, MdPending, MdCheckCircle, MdCancel, MdWavingHand, MdFolderSpecial, MdAssignment } from "react-icons/md";

import PageHeader from "components/ui/PageHeader";
import ApplicationPipelineCard from "components/ui/dashboard/ApplicationPipelineCard";
import NotificationsFeed from "components/ui/dashboard/NotificationsFeed";
import QuickActionsGrid from "components/ui/dashboard/QuickActionsGrid";
import StatCard    from "views/admin/default/components/StatCard";
import RecentAid   from "./components/RecentAid";
import { useGetStats } from "components/features/stats/hooks";
import { useGetApplications } from "components/features/applications/hooks";
import useAuth from "components/features/auth/hooks/useAuth";

const BeneficiaryDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { stats, loading } = useGetStats();
  const { applications: myApplications, loading: appsLoading } = useGetApplications();

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

  // No reliable timestamp on this endpoint (see GET /applications), so this
  // lists recent status changes rather than claiming true time-based recency.
  const notifications = useMemo(() => (
    myApplications
      .filter((a) => a.status !== "pending")
      .map((a) => ({
        id: a.id,
        message: t("beneficiary_dashboard.notif_application_status", {
          project: a.project?.title ?? "—",
          status: t(`applications.status_${a.status}`, { defaultValue: a.status }),
        }),
        type: a.status,
      }))
  ), [myApplications, t]);

  const quickActions = [
    { label: t("beneficiary_dashboard.action_browse_projects"), icon: <MdFolderSpecial className="h-5 w-5" />, to: "/beneficiary/projects" },
    { label: t("beneficiary_dashboard.action_my_requests"),     icon: <MdAssignment className="h-5 w-5" />,    to: "/beneficiary/requests" },
  ];

  return (
    <div className="flex flex-col gap-4">

      <PageHeader
        icon={<MdWavingHand className="h-5 w-5" />}
        title={t("beneficiary_dashboard.welcome_title", { name: user?.full_name?.split(" ")[0] ?? "" })}
        subtitle={t("beneficiary_dashboard.welcome_subtitle")}
      />

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-slate-900">{t("beneficiary_dashboard.pipeline_title")}</p>
        <ApplicationPipelineCard
          mode="single"
          applications={myApplications}
          loading={appsLoading}
          emptyText={t("beneficiary_dashboard.no_applications_pipeline")}
        />
      </div>

      {/* ── Main grid: left (2/3) + right (1/3) ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentAid applications={applications.recent ?? []} loading={loading} />
        </div>
        <div className="lg:col-span-1 rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("beneficiary_dashboard.quick_actions_title")}</p>
          <QuickActionsGrid actions={quickActions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("beneficiary_dashboard.notifications_title")}</p>
          <NotificationsFeed items={notifications} loading={appsLoading} emptyText={t("beneficiary_dashboard.no_notifications")} />
        </div>
      </div>

    </div>
  );
};

export default BeneficiaryDashboard;
