import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdVolunteerActivism, MdCheckCircle, MdDescription, MdSend } from "react-icons/md";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import { StorageDocumentField } from "components/form";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import {
  useGetApplications, useCreateApplication, useSubmitApplication,
  useGetApplicationDocuments, useCreateApplicationDocument,
  useUpdateApplicationDocument, useDeleteApplicationDocument,
} from "components/features/applications/hooks";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : null;

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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
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

/* A draft application: submit a file for each requirement, then send it for review. */
const DraftApplication = ({ application, requirements, onSubmitted }) => {
  const { t } = useTranslation();
  const { success } = useToast();
  const { documents, execute: fetchDocuments } = useGetApplicationDocuments();
  const { execute: submitApplication, loading: submitting, error: submitError } = useSubmitApplication();

  useEffect(() => { fetchDocuments(application.id); }, [application.id, fetchDocuments]);

  const docByRequirement = useMemo(
    () => Object.fromEntries(documents.map((d) => [d.requirement, d])),
    [documents]
  );
  const missingRequired = requirements.filter((r) => r.is_required && !docByRequirement[r.id]);

  const handleSubmit = async () => {
    try {
      const updated = await submitApplication(application.id);
      success(t("applications.toast_submitted"), t("applications.toast_submitted_sub"));
      onSubmitted(updated);
    } catch {
      // surfaced via submitError below
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
          <MdDescription className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">{t("applications.draft_title")}</p>
          <p className="text-sm text-slate-500">
            {requirements.length > 0 ? t("applications.draft_body") : t("applications.draft_body_no_docs")}
          </p>
        </div>
      </div>

      <AlertBanner message={submitError} className="rounded-xl border px-4 py-3" />

      {requirements.map((r) => (
        <RequirementRow
          key={r.id}
          requirement={r}
          document={docByRequirement[r.id]}
          applicationId={application.id}
          onChange={() => fetchDocuments(application.id)}
        />
      ))}

      {missingRequired.length > 0 && (
        <p className="text-xs text-slate-500">{t("applications.missing_required", { count: missingRequired.length })}</p>
      )}
      <Button
        onClick={handleSubmit}
        loading={submitting}
        disabled={missingRequired.length > 0}
        icon={<MdSend className="h-4 w-4" />}
        text={t("applications.submit_btn")}
      />
    </div>
  );
};

export default function ProjectApplySection({ projectId, requirements = [] }) {
  const { t } = useTranslation();
  const { applications, loading, refetch } = useGetApplications();
  const { execute: createApplication, loading: applying, error } = useCreateApplication();
  const [latest, setLatest] = useState(null);

  // `latest` holds the freshest copy of this project's application after a
  // create/submit, until the list refetch catches up.
  const existing = useMemo(
    () => latest ?? applications.find((a) => (a.project?.id ?? a.project) === projectId),
    [applications, projectId, latest]
  );

  const handleApply = async () => {
    try {
      const created = await createApplication({ project: projectId });
      setLatest(created);
      refetch();
    } catch {
      // error state surfaced via `error` below
    }
  };

  const handleSubmitted = (updated) => {
    setLatest((prev) => ({ ...prev, ...existing, ...updated, status: updated?.status ?? "pending" }));
    refetch();
  };

  if (loading) return null;

  return (
    <div>
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-900">
        <MdVolunteerActivism className="h-5 w-5 text-green" /> {t("projects.apply_title")}
      </h2>

      <AlertBanner message={error} className="mb-4 rounded-xl border px-4 py-3" />

      {existing?.status === "draft" ? (
        <DraftApplication application={existing} requirements={requirements} onSubmitted={handleSubmitted} />
      ) : existing ? (
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
          <Button
            onClick={handleApply}
            loading={applying}
            text={applying ? t("projects.applying") : t("projects.apply_button")}
          />
        </div>
      )}
    </div>
  );
}
