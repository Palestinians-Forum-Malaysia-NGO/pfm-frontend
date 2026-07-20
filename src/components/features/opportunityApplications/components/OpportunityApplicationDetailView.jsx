import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdDeleteOutline, MdGroups,
  MdPerson, MdEmail, MdPhone, MdCake, MdWc, MdPublic, MdLocationCity,
  MdDescription, MdLink, MdCalendarToday, MdCheckCircle, MdCancel,
} from "react-icons/md";
import Button       from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FormHeader    from "components/ui/form/FormHeader";
import InfoRow       from "components/ui/InfoRow";
import AlertBanner   from "components/ui/AlertBanner";
import Loading       from "components/loading/Loading";
import { TextareaField } from "components/form";
import OpportunityApplicationDeleteModal from "./OpportunityApplicationDeleteModal";
import {
  useGetOpportunityApplication, useDeleteOpportunityApplication,
  useApproveOpportunityApplication, useRejectOpportunityApplication,
} from "components/features/opportunityApplications/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import { isSafeUrl } from "utils/url";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric" });
};

const fmtDateTime = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const STATUS_BADGE = {
  pending:  "bg-amber-50 text-amber-600 border border-amber-200",
  approved: "bg-green/10 text-green border border-green/20",
  rejected: "bg-red-50 text-red-500 border border-red-200",
};

export default function OpportunityApplicationDetailView() {
  const { t } = useTranslation();
  const { opportunityId, id } = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { application, execute: fetchApplication, loading, error } = useGetOpportunityApplication();
  const { execute: approveApplication, loading: approving } = useApproveOpportunityApplication();
  const { execute: rejectApplication, loading: rejecting } = useRejectOpportunityApplication();
  const { execute: deleteApplication, loading: deleteLoading, error: deleteError } = useDeleteOpportunityApplication();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => { fetchApplication(opportunityId, id); }, [opportunityId, id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (application) setNote(application.note ?? ""); }, [application]);

  const STATUS_LABEL = {
    pending:  t("opportunityApplications.status_pending"),
    approved: t("opportunityApplications.status_approved"),
    rejected: t("opportunityApplications.status_rejected"),
  };

  const handleApprove = async () => {
    try {
      await approveApplication(opportunityId, id, note);
      success(t("opportunityApplications.toast_approved"), t("opportunityApplications.toast_approved_sub"));
      fetchApplication(opportunityId, id);
    } catch (err) {
      toastError(t("opportunityApplications.toast_approve_failed"), err?.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectApplication(opportunityId, id, note);
      success(t("opportunityApplications.toast_rejected"), t("opportunityApplications.toast_rejected_sub"));
      fetchApplication(opportunityId, id);
    } catch (err) {
      toastError(t("opportunityApplications.toast_reject_failed"), err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteApplication(opportunityId, id);
      success(t("opportunityApplications.toast_deleted"), t("opportunityApplications.toast_deleted_sub"));
      navigate(`${base}/opportunities/${opportunityId}`);
    } catch (err) {
      toastError(t("opportunityApplications.toast_delete_failed"), err?.message);
    }
  };

  if (loading)      return <Loading text={t("opportunityApplications.loading")} />;
  if (error)        return <AlertBanner message={error} />;
  if (!application) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdGroups className="h-5 w-5" />}
        title={application.applicant_full_name}
        subtitle={t("opportunityApplications.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("opportunityApplications.back")} onClick={() => navigate(`${base}/opportunities/${opportunityId}`)} />
            {isAdmin && (
              <Button variant="danger" icon={<MdDeleteOutline className="h-4 w-4" />} text={t("opportunityApplications.delete")} onClick={() => setDeleteOpen(true)} />
            )}
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Contact info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("opportunityApplications.section_contact")} subtitle={t("opportunityApplications.section_contact_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />} label={t("opportunityApplications.info_name")}  value={application.applicant_full_name} />
          <InfoRow icon={<MdEmail className="h-4 w-4" />}  label={t("opportunityApplications.info_email")} value={application.applicant_email} />
          <InfoRow icon={<MdPhone className="h-4 w-4" />}  label={t("opportunityApplications.info_phone")} value={application.applicant_phone || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("opportunityApplications.info_submitted")} value={fmtDateTime(application.created_at)} />
        </div>
      </div>

      {/* ── Personal info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdWc className="h-5 w-5" />} title={t("opportunityApplications.section_personal")} subtitle={t("opportunityApplications.section_personal_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCake className="h-4 w-4" />}          label={t("opportunityApplications.info_dob")}         value={fmtDate(application.applicant_date_of_birth)} />
          <InfoRow icon={<MdWc className="h-4 w-4" />}            label={t("opportunityApplications.info_gender")}      value={application.applicant_gender || "—"} />
          <InfoRow icon={<MdPublic className="h-4 w-4" />}        label={t("opportunityApplications.info_nationality")} value={application.applicant_nationality || "—"} />
          <InfoRow icon={<MdLocationCity className="h-4 w-4" />}  label={t("opportunityApplications.info_city")}        value={application.applicant_current_city || "—"} />
        </div>
      </div>

      {/* ── Documents & cover letter ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdDescription className="h-5 w-5" />} title={t("opportunityApplications.section_documents")} subtitle={t("opportunityApplications.section_documents_sub")} />
        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdLink className="h-4 w-4" />} label={t("opportunityApplications.info_resume")} value={
            isSafeUrl(application.applicant_resume)
              ? <a href={application.applicant_resume} target="_blank" rel="noreferrer" className="text-green hover:underline">{t("opportunityApplications.view_link")}</a>
              : "—"
          } />
          <InfoRow icon={<MdLink className="h-4 w-4" />} label={t("opportunityApplications.info_portfolio")} value={
            isSafeUrl(application.applicant_portfolio)
              ? <a href={application.applicant_portfolio} target="_blank" rel="noreferrer" className="text-green hover:underline">{t("opportunityApplications.view_link")}</a>
              : "—"
          } />
        </div>
        {application.applicant_cover_letter && (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t("opportunityApplications.info_cover_letter")}</p>
            <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{application.applicant_cover_letter}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Review ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdCheckCircle className="h-5 w-5" />}
          title={t("opportunityApplications.section_review")}
          subtitle={t("opportunityApplications.section_review_sub")}
          actions={
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_BADGE[application.status] ?? "bg-slate-100 text-slate-500"}`}>
              {STATUS_LABEL[application.status] ?? application.status}
            </span>
          }
        />
        {application.reviewed_by && (
          <p className="mb-4 text-xs text-slate-400">{t("opportunityApplications.info_reviewed_by")}: <span className="font-medium text-slate-600">{application.reviewed_by}</span></p>
        )}
        <TextareaField
          label={t("opportunityApplications.info_note")} field="note" rows={3} required={false}
          formData={{ note }} errors={{}} updateFormData={(_field, value) => setNote(value)}
        />
        <div className="mt-3 flex gap-2">
          <Button
            variant="primary" icon={<MdCheckCircle className="h-4 w-4" />}
            text={t("opportunityApplications.approve")} loading={approving}
            disabled={application.status === "approved"}
            onClick={handleApprove}
          />
          <Button
            variant="danger" icon={<MdCancel className="h-4 w-4" />}
            text={t("opportunityApplications.reject")} loading={rejecting}
            disabled={application.status === "rejected"}
            onClick={handleReject}
          />
        </div>
      </div>

      <OpportunityApplicationDeleteModal
        open={deleteOpen}
        application={application}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
