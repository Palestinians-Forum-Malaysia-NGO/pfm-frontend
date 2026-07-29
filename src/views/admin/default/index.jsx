import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdWavingHand, MdAdd, MdPersonAdd } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import ApplicationPipelineCard from "components/ui/dashboard/ApplicationPipelineCard";
import PendingTasksList from "components/ui/dashboard/PendingTasksList";
import NotificationsFeed from "components/ui/dashboard/NotificationsFeed";
import QuickActionsGrid from "components/ui/dashboard/QuickActionsGrid";
import BalanceCard from "./components/BalanceCard";
import BeneficiaryStatsWidget from "./components/BeneficiaryStatsWidget";
import OrgStatsOverview from "./components/OrgStatsOverview";
import { useGetStats } from "components/features/stats/hooks";
import { useGetFeedbacks } from "components/features/feedback/hooks";
import { useDashboardActivity } from "components/features/stats/hooks/useDashboardActivity";
import useAuth from "components/features/auth/hooks/useAuth";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useGetStats();
  const { feedbacks, loading: feedbackLoading } = useGetFeedbacks();

  const { pipelineStats, tasks, notifications, recentActivities } = useDashboardActivity(
    "admin_dashboard", "/admin", { applicationsStats: stats?.applications, feedbacks }
  );

  const quickActions = [
    { label: t("admin_dashboard.action_new_project"), icon: <MdAdd className="h-5 w-5" />,       to: "/admin/projects/create" },
    { label: t("admin_dashboard.action_new_user"),    icon: <MdPersonAdd className="h-5 w-5" />, to: "/admin/users/create" },
  ];

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto px-4">

      <PageHeader
        icon={<MdWavingHand className="h-5 w-5" />}
        title={t("admin_dashboard.welcome_title", { name: user?.full_name?.split(" ")[0] ?? "" })}
        subtitle={t("admin_dashboard.welcome_subtitle")}
      />

      <OrgStatsOverview stats={stats} loading={statsLoading} />

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-slate-900">{t("admin_dashboard.pipeline_title")}</p>
        <ApplicationPipelineCard
          mode="aggregate"
          stats={pipelineStats}
          loading={statsLoading}
          onStatusClick={(status) => navigate(status === "total" ? "/admin/applications" : `/admin/applications?status=${status}`)}
        />
      </div>

      <BalanceCard />
      <BeneficiaryStatsWidget />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("admin_dashboard.recent_activities_title")}</p>
          <NotificationsFeed items={recentActivities} loading={statsLoading || feedbackLoading} emptyText={t("admin_dashboard.no_recent_activity")} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("admin_dashboard.notifications_title")}</p>
          <NotificationsFeed items={notifications} loading={statsLoading || feedbackLoading} emptyText={t("admin_dashboard.no_notifications")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("admin_dashboard.pending_tasks_title")}</p>
          <PendingTasksList tasks={tasks} loading={statsLoading || feedbackLoading} emptyText={t("admin_dashboard.no_pending_tasks")} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("admin_dashboard.quick_actions_title")}</p>
          <QuickActionsGrid actions={quickActions} />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
