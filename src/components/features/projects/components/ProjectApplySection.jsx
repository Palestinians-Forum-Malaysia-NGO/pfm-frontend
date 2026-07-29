import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdVolunteerActivism, MdCheckCircle } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import { useGetApplications, useCreateApplication } from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

export default function ProjectApplySection({ projectId }) {
  const { t } = useTranslation();
  const { applications, loading, refetch } = useGetApplications();
  const { execute: createApplication, loading: applying, error } = useCreateApplication();
  const [justApplied, setJustApplied] = useState(null);

  const existing = useMemo(
    () => applications.find((a) => a.project?.id === projectId) ?? justApplied,
    [applications, projectId, justApplied]
  );

  const handleApply = async () => {
    try {
      const created = await createApplication({ project: projectId });
      setJustApplied(created);
      refetch();
    } catch {
      // error state surfaced via `error` below
    }
  };

  if (loading) return null;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
        <MdVolunteerActivism className="h-5 w-5 text-green" /> {t("projects.apply_title")}
      </h2>

      <AlertBanner message={error} className="mb-4 rounded-xl border px-4 py-3" />

      {existing ? (
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
            <MdVolunteerActivism className="h-6 w-6" />
          </div>
          <p className="text-sm text-slate-600">{t("projects.apply_body")}</p>
          <button
            onClick={handleApply}
            disabled={applying}
            className="inline-flex items-center gap-2 rounded-full bg-green px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-px hover:bg-green/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {applying ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              t("projects.apply_button")
            )}
          </button>
        </div>
      )}
    </div>
  );
}
