import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdWavingHand, MdAdd, MdFolderSpecial, MdPeople, MdAttachMoney, MdFactCheck, MdFileDownload } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import Button from "components/ui/buttons/Button";
import ApplicationPipelineCard from "components/ui/dashboard/ApplicationPipelineCard";
import PendingTasksList from "components/ui/dashboard/PendingTasksList";
import NotificationsFeed from "components/ui/dashboard/NotificationsFeed";
import QuickActionsGrid from "components/ui/dashboard/QuickActionsGrid";
import StatCard from "views/admin/default/components/StatCard";
import StaffApplicationsDonut from "./components/StaffApplicationsDonut";
import { useGetStats } from "components/features/stats/hooks";
import { useGetFeedbacks } from "components/features/feedback/hooks";
import { useDashboardActivity } from "components/features/stats/hooks/useDashboardActivity";
import { useExportOrganizationReport } from "components/features/reports/hooks";
import useAuth from "components/features/auth/hooks/useAuth";
import { useToast } from "components/ui/toast/ToastContext";

const fmtMYR = (val) => {
  const n = parseFloat(val);
  if (isNaN(n)) return "—";
  return `MYR ${n.toLocaleString("en-MY", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const StaffDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useGetStats();
  const { feedbacks, loading: feedbackLoading } = useGetFeedbacks();
  const { execute: exportReport, loading: exporting } = useExportOrganizationReport();
  const { error: toastError } = useToast();

  const projects = stats?.projects ?? {};
  const { pipelineStats, tasks, notifications, recentActivities } = useDashboardActivity(
    "staff_dashboard", "/staff", { applicationsStats: stats?.applications, feedbacks }
  );

  const CARDS = [
    { label: t("staff_dashboard.stat_projects"),             value: statsLoading ? "—" : (projects.total ?? 0),              icon: MdFolderSpecial, iconBg: "bg-green/10",  iconColor: "text-green" },
    { label: t("staff_dashboard.stat_beneficiaries_helped"), value: statsLoading ? "—" : (stats?.beneficiaries_helped ?? 0), icon: MdPeople,        iconBg: "bg-blue-50",   iconColor: "text-blue-500" },
    { label: t("staff_dashboard.stat_amount_spent"),         value: statsLoading ? "—" : fmtMYR(stats?.amount_spent),        icon: MdAttachMoney,   iconBg: "bg-pfmRed-50", iconColor: "text-pfmRed-500" },
    { label: t("staff_dashboard.stat_applications"),         value: statsLoading ? "—" : (pipelineStats.total ?? 0),        icon: MdFactCheck,     iconBg: "bg-amber-50",  iconColor: "text-amber-500" },
  ];

  const quickActions = [
    { label: t("staff_dashboard.action_new_project"), icon: <MdAdd className="h-5 w-5" />, to: "/staff/projects/create" },
  ];

  const handleExport = async () => {
    try {
      await exportReport();
    } catch (err) {
      toastError(t("staff_dashboard.toast_export_failed"), err?.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-5xl mx-auto px-4">

      <PageHeader
        icon={<MdWavingHand className="h-5 w-5" />}
        title={t("staff_dashboard.welcome_title", { name: user?.full_name?.split(" ")[0] ?? "" })}
        subtitle={t("staff_dashboard.welcome_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdFileDownload className="h-4 w-4" />} text={t("staff_dashboard.export_report")} loading={exporting} onClick={handleExport} />
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {CARDS.map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="mb-4 text-sm font-bold text-slate-900">{t("staff_dashboard.pipeline_title")}</p>
        <ApplicationPipelineCard
          mode="aggregate"
          stats={pipelineStats}
          loading={statsLoading}
          onStatusClick={(status) => navigate(status === "total" ? "/staff/applications" : `/staff/applications?status=${status}`)}
        />
      </div>

      <StaffApplicationsDonut byStatus={stats?.applications?.by_status} loading={statsLoading} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("staff_dashboard.recent_activities_title")}</p>
          <NotificationsFeed items={recentActivities} loading={statsLoading || feedbackLoading} emptyText={t("staff_dashboard.no_recent_activity")} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("staff_dashboard.notifications_title")}</p>
          <NotificationsFeed items={notifications} loading={statsLoading || feedbackLoading} emptyText={t("staff_dashboard.no_notifications")} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("staff_dashboard.pending_tasks_title")}</p>
          <PendingTasksList tasks={tasks} loading={statsLoading || feedbackLoading} emptyText={t("staff_dashboard.no_pending_tasks")} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-bold text-slate-900">{t("staff_dashboard.quick_actions_title")}</p>
          <QuickActionsGrid actions={quickActions} />
        </div>
      </div>

    </div>
  );
};

export default StaffDashboard;
