import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdArrowBack, MdCheckCircle, MdDescription, MdSend, MdPerson, MdBadge, MdVolunteerActivism,
} from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import Loading from "components/loading/Loading";
import StorageImage from "components/ui/StorageImage";
import { StorageDocumentField } from "components/form";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import {
  useGetApplications, useCreateApplication, useSubmitApplication,
  useGetApplicationDocuments, useCreateApplicationDocument,
  useUpdateApplicationDocument, useDeleteApplicationDocument,
} from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";
import { useGetProject } from "components/features/projects/hooks";
import { useProfile } from "components/features/profile/hooks";
import useAuth from "components/features/auth/hooks/useAuth";
import ProfileCompletionForm from "components/features/beneficiaries/components/ProfileCompletionForm";
import {
  missingProfileFields, missingIdentityDocuments,
} from "components/features/beneficiaries/constants/profileCompleteness";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

/* One numbered step of the form, with a done / to-do marker. */
const Step = ({ number, icon, title, done, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${done ? "bg-green text-white" : "bg-slate-100 text-slate-500"}`}>
        {done ? <MdCheckCircle className="h-5 w-5" /> : number}
      </div>
      <p className="flex items-center gap-2 text-base font-semibold text-slate-800">{icon} {title}</p>
    </div>
    {children}
  </div>
);

/* One document requirement: upload, replace or remove the file submitted for it. */
const RequirementRow = ({ requirement, document, applicationId, onChange }) => {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { error: toastError } = useToast();
  const { url } = useStorageUrl(document?.file, { forcePresigned: true });
  const { execute: createDocument } = useCreateApplicationDocument();
  const { execute: updateDocument } = useUpdateApplicationDocument();
  const { execute: deleteDocument } = useDeleteApplicationDocument();

  const name = (isAr && requirement.document_name_ar) || requirement.document_name;
  const desc = (isAr && requirement.description_ar)   || requirement.description;

  const handleUpload = async (fileKey) => {
    try {
      if (!fileKey) {
        if (document) await deleteDocument(applicationId, document.id);
      } else if (document) {
        await updateDocument(applicationId, document.id, { file: fileKey });
      } else {
        await createDocument(applicationId, { requirement: requirement.id, file: fileKey });
      }
      onChange();
    } catch (err) {
      toastError(t("applications.doc_save_failed"), err?.message);
    }
  };

  const handleRemove = async () => {
    try {
      await deleteDocument(applicationId, document.id);
      onChange();
    } catch (err) {
      toastError(t("applications.doc_save_failed"), err?.message);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-800" dir={isAr && requirement.document_name_ar ? "rtl" : undefined}>
        {name} {requirement.is_required && <span className="text-red-500">*</span>}
      </p>
      {desc && <p className="mt-0.5 text-xs text-slate-500" dir={isAr && requirement.description_ar ? "rtl" : undefined}>{desc}</p>}
      <StorageDocumentField
        folder="applications"
        accept=".pdf,.jpg,.jpeg,.png"
        currentName={document ? t("common.uploaded_file") : undefined}
        currentUrl={document ? url : undefined}
        onUpload={handleUpload}
        onRemove={handleRemove}
        field={`requirement_${requirement.id}`}
      />
    </div>
  );
};

/**
 * Beneficiary's application page for one project (/beneficiary/projects/:slug/apply).
 * Opening it starts a draft if there isn't one; the draft can only be
 * submitted once the profile details, identity documents and the project's
 * required documents are all complete.
 */
export default function ProjectApplicationForm() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const { slug } = useParams();
  const navigate = useNavigate();
  const projectPath = `/beneficiary/projects/${slug}`;
  const { success } = useToast();
  const { refreshUser } = useAuth();

  const { project, execute: fetchProject, loading: projectLoading, error: projectError } = useGetProject();
  const { applications, loading: appsLoading, refetch: refetchApps } = useGetApplications();
  const { execute: createApplication, error: createError } = useCreateApplication();
  const { profile, refetch: refetchProfile } = useProfile();
  const { documents, execute: fetchDocuments } = useGetApplicationDocuments();
  const { execute: submitApplication, loading: submitting, error: submitError } = useSubmitApplication();
  const [latest, setLatest] = useState(null);
  const creating = useRef(false);

  useEffect(() => { fetchProject(slug).catch(() => {}); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  // `latest` holds the freshest copy after create/submit until the list refetch catches up.
  const application = useMemo(
    () => latest ?? (project ? applications.find((a) => (a.project?.id ?? a.project) === project.id) : null),
    [latest, applications, project]
  );

  // Opening the page is the "apply" — start a draft so documents have somewhere to go.
  useEffect(() => {
    if (!project || appsLoading || application || creating.current) return;
    creating.current = true;
    createApplication({ project: project.id })
      .then((created) => { setLatest(created); refetchApps(); })
      .catch(() => {}); // surfaced via createError
  }, [project, appsLoading, application]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (application?.status === "draft") fetchDocuments(application.id);
  }, [application?.id, application?.status, fetchDocuments]);

  const requirements = project?.document_requirements ?? [];
  const docByRequirement = useMemo(() => Object.fromEntries(documents.map((d) => [d.requirement, d])), [documents]);
  const missingRequired = requirements.filter((r) => r.is_required && !docByRequirement[r.id]);
  const profileIncomplete = !!profile && missingProfileFields(profile).length > 0;
  const missingIdDocs = profile ? missingIdentityDocuments(profile) : [];
  const canSubmit = !!profile && !profileIncomplete && missingIdDocs.length === 0 && missingRequired.length === 0;

  const handleSubmit = async () => {
    try {
      const updated = await submitApplication(application.id);
      success(t("applications.toast_submitted"), t("applications.toast_submitted_sub"));
      setLatest({ ...application, ...updated, status: updated?.status ?? "pending" });
      refetchApps();
    } catch {
      // surfaced via submitError
    }
  };

  if (projectLoading || (!project && !projectError)) return <Loading text={t("projects.public_loading")} />;
  if (projectError || !project) return <AlertBanner message={projectError ?? t("projects.public_not_found_title")} />;

  const title = (isAr && project.title_ar) || project.title;

  const header = (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <button type="button" onClick={() => navigate(projectPath)} title={t("applications.back_to_project")}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50">
        <MdArrowBack className="h-4 w-4 rtl:rotate-180" />
      </button>
      {project.cover_image && (
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200">
          <StorageImage fileKey={project.cover_image} alt={title} className="h-full w-full object-cover" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-green">{t("projects.apply_button")}</p>
        <h1 className="truncate text-lg font-bold text-slate-900">{title}</h1>
      </div>
    </div>
  );

  // Already submitted — show where it stands instead of the form.
  if (application && application.status !== "draft") {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {header}
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
            <MdCheckCircle className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">{t("projects.applied_title")}</p>
          {application.created_at && (
            <p className="text-sm text-slate-500">{t("projects.applied_body", { date: fmtDate(application.created_at) })}</p>
          )}
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${APPLICATION_STATUS_BADGE[application.status] ?? "bg-slate-100 text-slate-500"}`}>
            {t(`applications.status_${application.status}`, { defaultValue: application.status })}
          </span>
          <Button variant="ghost" text={t("applications.back_to_project")} onClick={() => navigate(projectPath)} />
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        {header}
        {createError ? <AlertBanner message={createError} /> : <Loading text={t("projects.applying")} />}
      </div>
    );
  }

  let step = 0;
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {header}

      <div className="flex items-start gap-3 rounded-2xl border border-green/20 bg-green/5 p-4">
        <MdVolunteerActivism className="mt-0.5 h-5 w-5 shrink-0 text-green" />
        <p className="text-sm text-slate-600">{t("applications.form_intro")}</p>
      </div>

      <AlertBanner message={submitError} className="rounded-xl border px-4 py-3" />

      <Step number={++step} icon={<MdPerson className="h-5 w-5 text-slate-400" />} title={t("applications.step_profile")} done={!!profile && !profileIncomplete}>
        {!profile ? (
          <p className="text-sm text-slate-400">{t("common.loading")}</p>
        ) : profileIncomplete ? (
          <ProfileCompletionForm profile={profile} onSaved={() => { refetchProfile(); refreshUser?.(); }} />
        ) : (
          <p className="text-sm text-slate-500">{t("applications.step_profile_done")}</p>
        )}
      </Step>

      {missingIdDocs.length > 0 && (
        <Step number={++step} icon={<MdBadge className="h-5 w-5 text-slate-400" />} title={t("applications.id_docs_title")} done={false}>
          <ul className="list-disc ps-5 text-sm text-red-600">
            {missingIdDocs.map((key) => <li key={key}>{t(`beneficiaries.${key}`)}</li>)}
          </ul>
          <p className="mt-2 text-xs text-slate-600">{t("applications.id_docs_contact")}</p>
        </Step>
      )}

      {requirements.length > 0 && (
        <Step number={++step} icon={<MdDescription className="h-5 w-5 text-slate-400" />} title={t("applications.step_docs")} done={missingRequired.length === 0}>
          <div className="flex flex-col gap-3">
            {requirements.map((r) => (
              <RequirementRow
                key={r.id}
                requirement={r}
                document={docByRequirement[r.id]}
                applicationId={application.id}
                onChange={() => fetchDocuments(application.id)}
              />
            ))}
          </div>
        </Step>
      )}

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-5">
        {profileIncomplete && <p className="text-xs text-slate-500">{t("applications.profile_incomplete")}</p>}
        {missingIdDocs.length > 0 && <p className="text-xs text-slate-500">{t("applications.id_docs_title")}</p>}
        {missingRequired.length > 0 && (
          <p className="text-xs text-slate-500">{t("applications.missing_required", { count: missingRequired.length })}</p>
        )}
        <Button
          onClick={handleSubmit}
          loading={submitting}
          disabled={!canSubmit}
          icon={<MdSend className="h-4 w-4" />}
          text={t("applications.submit_btn")}
        />
        <p className="text-center text-xs text-slate-400">{t("applications.draft_saved_hint")}</p>
      </div>
    </div>
  );
}
