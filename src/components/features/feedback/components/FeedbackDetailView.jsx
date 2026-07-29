import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdDeleteOutline, MdRateReview,
  MdPerson, MdFolderSpecial, MdCalendarToday, MdStar,
  MdCheckCircle, MdCancel,
} from "react-icons/md";
import Button       from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FormHeader    from "components/ui/form/FormHeader";
import InfoRow       from "components/ui/InfoRow";
import AlertBanner   from "components/ui/AlertBanner";
import Loading       from "components/loading/Loading";
import StarRating    from "components/ui/StarRating";
import { InputField, TextareaField } from "components/form";
import FeedbackDeleteModal from "./FeedbackDeleteModal";
import {
  useGetFeedback, useUpdateFeedback, useDeleteFeedback,
  useApproveFeedback, useRejectFeedback,
} from "components/features/feedback/hooks";
import { useGetProjects } from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const STATUS_BADGE = {
  pending:  "bg-amber-50 text-amber-600 border border-amber-200",
  approved: "bg-green/10 text-green border border-green/20",
  rejected: "bg-red-50 text-red-500 border border-red-200",
};

export default function FeedbackDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { feedback, execute: fetchFeedback, loading, error } = useGetFeedback();
  const { execute: updateFeedback, loading: saving } = useUpdateFeedback();
  const { execute: approveFeedback, loading: approving } = useApproveFeedback();
  const { execute: rejectFeedback, loading: rejecting } = useRejectFeedback();
  const { execute: deleteFeedback, loading: deleteLoading, error: deleteError } = useDeleteFeedback();
  const { success, error: toastError } = useToast();
  const { projects } = useGetProjects();
  const projectTitleById = Object.fromEntries(projects.map((p) => [p.id, p.title]));
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editForm, setEditForm]     = useState({ full_name: "", message: "", rating: 0 });
  const [errors, setErrors]         = useState({});

  useEffect(() => { fetchFeedback(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (feedback) setEditForm({ full_name: feedback.full_name, message: feedback.message, rating: feedback.rating });
  }, [feedback]);

  const updateEditForm = (field, value) => setEditForm((p) => ({ ...p, [field]: value }));

  const STATUS_LABEL = {
    pending:  t("feedbackMessages.status_pending"),
    approved: t("feedbackMessages.status_approved"),
    rejected: t("feedbackMessages.status_rejected"),
  };

  const handleSave = async () => {
    setErrors({});
    try {
      await updateFeedback(id, editForm);
      success(t("feedbackMessages.toast_updated"), t("feedbackMessages.toast_updated_sub"));
      fetchFeedback(id);
    } catch (err) {
      toastError(t("feedbackMessages.toast_update_failed"), err?.message);
    }
  };

  const handleApprove = async () => {
    try {
      await approveFeedback(id);
      success(t("feedbackMessages.toast_approved"), t("feedbackMessages.toast_approved_sub"));
      fetchFeedback(id);
    } catch (err) {
      toastError(t("feedbackMessages.toast_approve_failed"), err?.message);
    }
  };

  const handleReject = async () => {
    try {
      await rejectFeedback(id);
      success(t("feedbackMessages.toast_rejected"), t("feedbackMessages.toast_rejected_sub"));
      fetchFeedback(id);
    } catch (err) {
      toastError(t("feedbackMessages.toast_reject_failed"), err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeedback(id);
      success(t("feedbackMessages.toast_deleted"), t("feedbackMessages.toast_deleted_sub"));
      navigate(`${base}/feedback`);
    } catch (err) {
      toastError(t("feedbackMessages.toast_delete_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("feedbackMessages.loading")} />;
  if (error)     return <AlertBanner message={error} />;
  if (!feedback) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdRateReview className="h-5 w-5" />}
        title={feedback.full_name}
        subtitle={t("feedbackMessages.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("feedbackMessages.back")} onClick={() => navigate(`${base}/feedback`)} />
            {isAdmin && (
              <Button variant="danger" icon={<MdDeleteOutline className="h-4 w-4" />} text={t("feedbackMessages.delete")} onClick={() => setDeleteOpen(true)} />
            )}
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Reviewer info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("feedbackMessages.section_reviewer")} subtitle={t("feedbackMessages.section_reviewer_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("feedbackMessages.info_name")}      value={feedback.full_name} />
          <InfoRow icon={<MdFolderSpecial className="h-4 w-4" />}  label={t("feedbackMessages.info_project")}   value={feedback.project?.title ?? projectTitleById[feedback.project] ?? "—"} />
          <InfoRow icon={<MdStar className="h-4 w-4" />}           label={t("feedbackMessages.info_rating")}    value={<StarRating value={feedback.rating} size="h-4 w-4" />} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />}  label={t("feedbackMessages.info_submitted")} value={fmtDate(feedback.created_at)} />
        </div>
      </div>

      {/* ── Message content — editable for admin, read-only for staff ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdRateReview className="h-5 w-5" />} title={t("feedbackMessages.section_message")} subtitle={t("feedbackMessages.section_message_sub")} />
        {isAdmin ? (
          <div className="flex flex-col gap-4">
            <InputField
              label={t("feedbackMessages.info_name")} field="full_name" required={false}
              formData={editForm} errors={errors} updateFormData={updateEditForm}
            />
            <div>
              <p className="mb-1.5 text-sm font-medium text-slate-700">{t("feedbackMessages.info_rating")}</p>
              <StarRating value={editForm.rating} onChange={(v) => updateEditForm("rating", v)} />
            </div>
            <TextareaField
              label={t("feedbackMessages.info_message")} field="message" rows={5} required={false}
              formData={editForm} errors={errors} updateFormData={updateEditForm}
            />
            <div>
              <Button variant="primary" text={t("feedbackMessages.save_changes")} loading={saving} onClick={handleSave} />
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{feedback.message}</p>
        )}
      </div>

      {/* ── Moderation — admin only ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader
          icon={<MdCheckCircle className="h-5 w-5" />}
          title={t("feedbackMessages.section_moderation")}
          subtitle={t("feedbackMessages.section_moderation_sub")}
          actions={
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_BADGE[feedback.status] ?? "bg-slate-100 text-slate-500"}`}>
              {STATUS_LABEL[feedback.status] ?? feedback.status}
            </span>
          }
        />
        {isAdmin && (
          <div className="flex gap-2">
            <Button
              variant="primary" icon={<MdCheckCircle className="h-4 w-4" />}
              text={t("feedbackMessages.approve")} loading={approving}
              disabled={feedback.status === "approved"}
              onClick={handleApprove}
            />
            <Button
              variant="danger" icon={<MdCancel className="h-4 w-4" />}
              text={t("feedbackMessages.reject")} loading={rejecting}
              disabled={feedback.status === "rejected"}
              onClick={handleReject}
            />
          </div>
        )}
      </div>

      <FeedbackDeleteModal
        open={deleteOpen}
        feedback={feedback}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
