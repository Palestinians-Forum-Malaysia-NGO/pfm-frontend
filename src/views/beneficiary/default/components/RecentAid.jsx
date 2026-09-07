import { useTranslation } from "react-i18next";

const STATUS_STYLES = {
  approved: "border border-green/50 text-[#006833] bg-green/10",
  pending:  "border border-amber-200 text-amber-600 bg-amber-50",
  rejected: "border border-red-200 text-red-500 bg-red-50",
};

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" });
};

const RecentAid = ({ applications, loading }) => {
  const { t } = useTranslation();
  const STATUS_LABEL = {
    pending:  t("applications.status_pending"),
    approved: t("applications.status_approved"),
    rejected: t("applications.status_rejected"),
  };
  const COLUMNS = [
    t("beneficiary_dashboard.col_project"),
    t("beneficiary_dashboard.col_date"),
    t("beneficiary_dashboard.col_status"),
  ];

  return (
  <div className="rounded-2xl bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-start justify-between">
      <div>
        <h3 className="font-bold text-navy-700">{t("beneficiary_dashboard.recent_activity_title")}</h3>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px]">
        <thead>
          <tr className="border-b border-gray-100">
            {COLUMNS.map((col) => (
              <th key={col} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading ? (
            [1, 2, 3].map((i) => (
              <tr key={i}>
                <td className="py-3.5 pr-4"><div className="h-4 w-32 animate-pulse rounded bg-slate-100" /></td>
                <td className="py-3.5 pr-4"><div className="h-4 w-20 animate-pulse rounded bg-slate-100" /></td>
                <td className="py-3.5"><div className="h-5 w-16 animate-pulse rounded-full bg-slate-100" /></td>
              </tr>
            ))
          ) : applications.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-6 text-center text-sm text-gray-400">
                {t("beneficiary_dashboard.no_applications_yet")}
              </td>
            </tr>
          ) : (
            applications.map((app, i) => (
              <tr key={i} className="transition hover:bg-gray-50/60">
                <td className="py-3.5 pr-4 text-sm text-gray-600">{app.project_title}</td>
                <td className="py-3.5 pr-4 text-sm text-gray-400">{fmtDate(app.created_at)}</td>
                <td className="py-3.5">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[app.status] ?? STATUS_STYLES.pending}`}>
                    {STATUS_LABEL[app.status] ?? app.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default RecentAid;
