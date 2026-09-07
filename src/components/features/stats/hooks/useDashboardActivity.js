import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short" }) : "";

/**
 * Derives Application Pipeline stats + Pending Tasks + Notifications + Recent
 * Activities from data already fetched via useGetStats()/useGetFeedbacks() —
 * shared between the admin and staff dashboards, which need identical logic
 * differing only in i18n namespace and route prefix.
 *
 * @param {string} namespace - locale namespace, e.g. "admin_dashboard"
 * @param {string} basePath  - route prefix, e.g. "/admin"
 */
export function useDashboardActivity(namespace, basePath, { applicationsStats, feedbacks }) {
  const { t } = useTranslation();

  const recentApps = applicationsStats?.recent ?? [];
  const pendingAppsCount = applicationsStats?.by_status?.pending ?? 0;
  const pendingFeedbackCount = (feedbacks ?? []).filter((f) => f.status === "pending").length;

  const pipelineStats = {
    total:    applicationsStats?.total ?? 0,
    pending:  applicationsStats?.by_status?.pending ?? 0,
    approved: applicationsStats?.by_status?.approved ?? 0,
    rejected: applicationsStats?.by_status?.rejected ?? 0,
  };

  const tasks = useMemo(() => {
    const list = [];
    if (pendingAppsCount > 0) {
      list.push({ id: "apps", label: t(`${namespace}.task_applications_pending`, { count: pendingAppsCount }), to: `${basePath}/applications` });
    }
    if (pendingFeedbackCount > 0) {
      list.push({ id: "feedback", label: t(`${namespace}.task_feedback_pending`, { count: pendingFeedbackCount }), to: `${basePath}/feedback` });
    }
    return list;
  }, [pendingAppsCount, pendingFeedbackCount, namespace, basePath, t]);

  const notifications = useMemo(() => {
    const appItems = recentApps
      .filter((a) => a.status !== "pending")
      .map((a, i) => ({
        id: `app-${i}`,
        message: t(`${namespace}.notif_application`, { project: a.project_title, status: t(`applications.status_${a.status}`, { defaultValue: a.status }) }),
        time: fmtDate(a.created_at),
        type: a.status,
        _ts: a.created_at,
      }));
    const feedbackItems = (feedbacks ?? [])
      .filter((f) => f.status !== "pending")
      .map((f) => ({
        id: `fb-${f.id}`,
        message: t(`${namespace}.notif_feedback`, { name: f.full_name, status: t(`applications.status_${f.status}`, { defaultValue: f.status }) }),
        time: fmtDate(f.created_at),
        type: f.status,
        _ts: f.created_at,
      }));
    return [...appItems, ...feedbackItems].sort((a, b) => new Date(b._ts) - new Date(a._ts)).slice(0, 6);
  }, [recentApps, feedbacks, namespace, t]);

  const recentActivities = useMemo(() => {
    const appItems = recentApps.map((a, i) => ({
      id: `ra-app-${i}`,
      message: t(`${namespace}.activity_application`, { project: a.project_title, status: t(`applications.status_${a.status}`, { defaultValue: a.status }) }),
      time: fmtDate(a.created_at),
      type: a.status,
      _ts: a.created_at,
    }));
    const feedbackItems = (feedbacks ?? []).map((f) => ({
      id: `ra-fb-${f.id}`,
      message: t(`${namespace}.activity_feedback`, { name: f.full_name }),
      time: fmtDate(f.created_at),
      type: "info",
      _ts: f.created_at,
    }));
    return [...appItems, ...feedbackItems].sort((a, b) => new Date(b._ts) - new Date(a._ts)).slice(0, 6);
  }, [recentApps, feedbacks, namespace, t]);

  return { pipelineStats, tasks, notifications, recentActivities };
}
