import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdAssignment } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import Loading from "components/loading/Loading";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import { useGetApplications } from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

const BeneficiaryRequests = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applications, loading, error } = useGetApplications();

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        icon={<MdAssignment className="h-5 w-5" />}
        title={t("beneficiary_dashboard.requests_page_title")}
        subtitle={t("beneficiary_dashboard.requests_page_desc")}
      />

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <AlertBanner message={error} />

        {loading ? (
          <Loading text={t("applications.loading")} />
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <MdAssignment className="h-6 w-6" />
            </div>
            <p className="text-sm text-slate-500">{t("beneficiary_dashboard.no_applications_yet")}</p>
            <Button
              variant="primary"
              text={t("beneficiary_dashboard.browse_projects_btn")}
              onClick={() => navigate("/beneficiary/projects")}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead>
                <tr className="border-b border-slate-100">
                  {[
                    t("beneficiary_dashboard.col_project"),
                    t("beneficiary_dashboard.col_date"),
                    t("beneficiary_dashboard.col_status"),
                  ].map((col) => (
                    <th key={col} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => app.project?.slug && navigate(`/beneficiary/projects/${app.project.slug}`)}
                    className="cursor-pointer transition-colors duration-150 hover:bg-slate-50/60"
                  >
                    <td className="py-3.5 pr-4 text-sm font-medium text-slate-700">{app.project?.title ?? "—"}</td>
                    <td className="py-3.5 pr-4 text-sm text-slate-400">{fmtDate(app.created_at)}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${APPLICATION_STATUS_BADGE[app.status] ?? "bg-slate-100 text-slate-500"}`}>
                        {t(`applications.status_${app.status}`, { defaultValue: app.status })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BeneficiaryRequests;
