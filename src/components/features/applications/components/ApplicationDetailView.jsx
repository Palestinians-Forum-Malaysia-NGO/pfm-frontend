import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdDeleteOutline, MdFactCheck, MdCheckCircle, MdCancel,
  MdPerson, MdFolderSpecial, MdCalendarToday, MdOpenInNew, MdEdit, MdSave, MdClose, MdBadge,
} from "react-icons/md";
import Button         from "components/ui/buttons/Button";
import PageHeader     from "components/ui/PageHeader";
import FormHeader     from "components/ui/form/FormHeader";
import InfoRow        from "components/ui/InfoRow";
import AlertBanner    from "components/ui/AlertBanner";
import StorageFileLink from "components/ui/StorageFileLink";
import DropdownButton from "components/ui/buttons/DropdownButton";
import Loading        from "components/loading/Loading";
import ApplicationDeleteModal from "./ApplicationDeleteModal";
import ApplicationActionModal from "./ApplicationActionModal";
import { APPLICATION_STATUS_BADGE } from "components/features/applications/constants/applications";
import {
  useGetApplication, useDeleteApplication,
  useApproveApplication, useRejectApplication, useUpdateApplication,
} from "components/features/applications/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" });
};

export default function ApplicationDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { application, execute: fetchApplication, loading, error } = useGetApplication();
  const { execute: deleteApplication, loading: deleteLoading, error: deleteError } = useDeleteApplication();
  const { execute: approveApplication, loading: approveLoading } = useApproveApplication();
  const { execute: rejectApplication, loading: rejectLoading } = useRejectApplication();
  const { execute: updateApplication, loading: noteLoading } = useUpdateApplication();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [action, setAction] = useState(null); // "approve" | "reject"
  const [editingNote, setEditingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  useEffect(() => { fetchApplication(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteApplication(id);
      success(t("applications.toast_deleted"), t("applications.toast_deleted_sub"));
      navigate(`${base}/applications`);
    } catch (err) {
      toastError(t("applications.toast_delete_failed"), err?.message);
    }
  };

  const handleActionConfirm = async (note) => {
    try {
      if (action === "approve") await approveApplication(id, note);
      else await rejectApplication(id, note);
      success(action === "approve" ? t("applications.toast_approved") : t("applications.toast_rejected"));
      setAction(null);
      fetchApplication(id);
    } catch (err) {
      toastError(action === "approve" ? t("applications.toast_approve_failed") : t("applications.toast_reject_failed"), err?.message);
    }
  };

  const startEditNote = () => { setNoteDraft(application?.note ?? ""); setEditingNote(true); };
  const saveNote = async () => {
    try {
      await updateApplication(id, { note: noteDraft });
      success(t("applications.toast_note_updated"));
      setEditingNote(false);
      fetchApplication(id);
    } catch (err) {
      toastError(t("applications.toast_note_update_failed"), err?.message);
    }
  };

  if (loading) return <Loading text={t("applications.loading")} />;
  if (error)   return <AlertBanner message={error} />;
  if (!application) return null;

  const { project, beneficiary, status, approved_by, rejected_by, note, created_at, updated_at } = application;
  const isPending = status === "pending";

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdFactCheck className="h-5 w-5" />}
        title={beneficiary?.user?.full_name ?? t("applications.detail_subtitle")}
        subtitle={t("applications.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("applications.back")} onClick={() => navigate(`${base}/applications`)} />
            <DropdownButton
              label={t("applications.actions")}
              items={[
                ...(isPending ? [
                  { label: t("applications.approve_btn"), icon: <MdCheckCircle className="h-4 w-4" />, onClick: () => setAction("approve") },
                  { label: t("applications.reject_btn"),  icon: <MdCancel className="h-4 w-4" />,      onClick: () => setAction("reject"), variant: "danger" },
                ] : []),
                ...(isAdmin ? [
                  ...(isPending ? [{ divider: true }] : []),
                  { label: t("applications.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
                ] : []),
              ]}
            />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="h-24 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
          <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
        </div>
        <div className="px-6 pb-6">
          <div className="-mt-8 mb-4 flex items-end justify-between">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10 text-green ring-4 ring-white shadow-md">
              <MdFactCheck className="h-8 w-8" />
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              APPLICATION_STATUS_BADGE[status] ?? "bg-slate-100 text-slate-500"
            }`}>
              {t(`applications.status_${status}`, { defaultValue: status ?? "—" })}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">{beneficiary?.user?.full_name ?? "—"}</h2>
          <p className="mt-0.5 text-sm text-slate-500">{beneficiary?.user?.email}</p>
        </div>
      </div>

      {/* ── Project summary ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <FormHeader icon={<MdFolderSpecial className="h-5 w-5" />} title={t("applications.section_project")} subtitle={t("applications.section_project_sub")} />
          <Button variant="secondary" icon={<MdOpenInNew className="h-4 w-4" />} text={t("applications.view_full_project")} onClick={() => navigate(`${base}/projects/${project?.id}`)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdFolderSpecial className="h-4 w-4" />} label={t("applications.info_project_title")} value={project?.title} />
          {project?.title_ar && <InfoRow icon={<MdFolderSpecial className="h-4 w-4" />} label={t("applications.info_project_title_ar")} value={project.title_ar} />}
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />} label={t("applications.info_project_status")} value={t(`projects.status_${project?.status}`, { defaultValue: project?.status ?? "—" })} />
        </div>
      </div>

      {/* ── Beneficiary summary ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("applications.section_beneficiary")} subtitle={t("applications.section_beneficiary_sub")} />
          <Button variant="secondary" icon={<MdOpenInNew className="h-4 w-4" />} text={t("applications.view_full_beneficiary")} onClick={() => navigate(`${base}/beneficiaries/${beneficiary?.id}`)} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("applications.info_beneficiary_name")} value={beneficiary?.user?.full_name} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("applications.info_beneficiary_email")} value={beneficiary?.user?.email} />
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />} label={t("applications.info_beneficiary_account_status")} value={beneficiary?.account_status} />
        </div>
        {beneficiary?.classifications?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {beneficiary.classifications.map((c) => (
              <span key={c.id} className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {c.name}
              </span>
            ))}
          </div>
        )}
        {beneficiary?.id_document && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3">
            <MdBadge className="h-5 w-5 shrink-0 text-green" />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">{t("beneficiaries.info_id_doc")}</p>
              <StorageFileLink fileKey={beneficiary.id_document} className="text-sm font-medium text-green hover:underline">
                {t("beneficiaries.view_doc")}
              </StorageFileLink>
            </div>
          </div>
        )}
      </div>

      {/* ── Supporting Documents ── */}
      {beneficiary?.supporting_documents?.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdBadge className="h-5 w-5" />} title={t("beneficiaries.section_documents")} subtitle={t("beneficiaries.section_documents_sub")} />
          <div className="flex flex-col gap-2">
            {beneficiary.supporting_documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{doc.document_name}</p>
                  <p className="text-xs text-slate-400">{doc.document_type}</p>
                </div>
                {doc.document_file && (
                  <StorageFileLink fileKey={doc.document_file} className="text-xs font-medium text-green hover:underline">
                    {t("beneficiaries.doc_view")}
                  </StorageFileLink>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Application details ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdFactCheck className="h-5 w-5" />} title={t("applications.section_info_title")} subtitle={t("applications.section_info_subtitle")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCheckCircle className="h-4 w-4" />}   label={t("applications.info_approved_by")} value={approved_by ?? "—"} />
          <InfoRow icon={<MdCancel className="h-4 w-4" />}        label={t("applications.info_rejected_by")} value={rejected_by ?? "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("applications.info_created")}     value={formatDate(created_at)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("applications.info_updated")}     value={formatDate(updated_at)} />
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">{t("applications.info_note")}</p>
            {!editingNote && (
              <button onClick={startEditNote} className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700">
                <MdEdit className="h-4 w-4" />
              </button>
            )}
          </div>
          {editingNote ? (
            <div className="flex flex-col gap-2">
              <textarea
                rows={3}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={t("applications.note_placeholder")}
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 outline-none transition-all focus:border-green focus:bg-slate-100/70"
              />
              <div className="flex gap-2">
                <Button variant="ghost" icon={<MdClose className="h-4 w-4" />} text={t("applications.cancel_btn")} onClick={() => setEditingNote(false)} disabled={noteLoading} />
                <Button variant="primary" icon={<MdSave className="h-4 w-4" />} text={t("applications.save_changes")} onClick={saveNote} loading={noteLoading} />
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{note || t("applications.no_note")}</p>
          )}
        </div>
      </div>

      <ApplicationDeleteModal
        open={deleteOpen}
        application={application}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />

      <ApplicationActionModal
        open={!!action}
        action={action}
        application={application}
        onClose={() => setAction(null)}
        onConfirm={handleActionConfirm}
        loading={action === "approve" ? approveLoading : rejectLoading}
      />
    </div>
  );
}
