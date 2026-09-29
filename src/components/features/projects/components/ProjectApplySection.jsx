import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdVolunteerActivism, MdCheckCircle, MdEditNote } from "react-icons/md";
import Button from "components/ui/buttons/Button";
import { useGetApplications } from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

/* Apply-for-assistance card on the project page. The application itself is
   filled in on its own page (ProjectApplicationForm); this only links to it
   or shows where an already-submitted application stands. */
export default function ProjectApplySection({ projectId, slug }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { applications, loading } = useGetApplications();
  const existing = applications.find((a) => (a.project?.id ?? a.project) === projectId);
  const applyPath = `/beneficiary/projects/${slug}/apply`;

  if (loading) return null;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
        <MdVolunteerActivism className="h-5 w-5 text-green" /> {t("projects.apply_title")}
      </h2>

      {existing && existing.status !== "draft" ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
            <MdCheckCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{t("projects.applied_title")}</p>
          {existing.created_at && (
            <p className="text-sm text-slate-500">{t("projects.applied_body", { date: fmtDate(existing.created_at) })}</p>
          )}
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${APPLICATION_STATUS_BADGE[existing.status] ?? "bg-slate-100 text-slate-500"}`}>
            {t(`applications.status_${existing.status}`, { defaultValue: existing.status })}
          </span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
            {existing ? <MdEditNote className="h-6 w-6" /> : <MdVolunteerActivism className="h-6 w-6" />}
          </div>
          <p className="text-sm text-slate-600">{existing ? t("applications.continue_body") : t("projects.apply_body")}</p>
          <Button
            onClick={() => navigate(applyPath)}
            text={existing ? t("applications.continue_btn") : t("projects.apply_button")}
          />
        </div>
      )}
    </div>
  );
}
