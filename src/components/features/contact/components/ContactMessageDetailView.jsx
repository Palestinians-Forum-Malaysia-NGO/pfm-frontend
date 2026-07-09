import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdDeleteOutline, MdMailOutline,
  MdPerson, MdEmail, MdCalendarToday, MdSubject,
} from "react-icons/md";
import Button       from "components/ui/buttons/Button";
import PageHeader    from "components/ui/PageHeader";
import FormHeader    from "components/ui/form/FormHeader";
import InfoRow       from "components/ui/InfoRow";
import AlertBanner   from "components/ui/AlertBanner";
import Loading       from "components/loading/Loading";
import { SelectField } from "components/form";
import ContactMessageDeleteModal from "./ContactMessageDeleteModal";
import { useGetContactMessage, useUpdateContactStatus, useDeleteContactMessage } from "components/features/contact/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-MY", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function ContactMessageDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { message, execute: fetchMessage, loading, error } = useGetContactMessage();
  const { execute: updateStatus, loading: saving } = useUpdateContactStatus();
  const { execute: deleteMessage, loading: deleteLoading, error: deleteError } = useDeleteContactMessage();
  const { success, error: toastError } = useToast();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ status: "pending" });

  useEffect(() => { fetchMessage(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (message) setStatusForm({ status: message.status }); }, [message]);

  const STATUS_OPTIONS = [
    { value: "pending",   label: t("contactMessages.status_pending") },
    { value: "follow_up", label: t("contactMessages.status_follow_up") },
    { value: "closed",    label: t("contactMessages.status_closed") },
  ];

  const handleStatusChange = async (_field, value) => {
    setStatusForm({ status: value });
    try {
      await updateStatus(id, value);
      success(t("contactMessages.toast_status_updated"), t("contactMessages.toast_status_updated_sub"));
      fetchMessage(id);
    } catch (err) {
      toastError(t("contactMessages.toast_status_update_failed"), err?.message);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMessage(id);
      success(t("contactMessages.toast_deleted"), t("contactMessages.toast_deleted_sub"));
      navigate(`${base}/contact-messages`);
    } catch (err) {
      toastError(t("contactMessages.toast_delete_failed"), err?.message);
    }
  };

  if (loading)  return <Loading text={t("contactMessages.loading")} />;
  if (error)    return <AlertBanner message={error} />;
  if (!message) return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdMailOutline className="h-5 w-5" />}
        title={message.subject || t("contactMessages.detail_subtitle")}
        subtitle={t("contactMessages.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("contactMessages.back")} onClick={() => navigate(`${base}/contact-messages`)} />
            <Button variant="danger" icon={<MdDeleteOutline className="h-4 w-4" />} text={t("contactMessages.delete")} onClick={() => setDeleteOpen(true)} />
          </>
        }
      />

      <AlertBanner message={deleteError} />

      {/* ── Sender info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdPerson className="h-5 w-5" />} title={t("contactMessages.section_sender")} subtitle={t("contactMessages.section_sender_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdPerson className="h-4 w-4" />}         label={t("contactMessages.info_name")}      value={message.full_name} />
          <InfoRow icon={<MdEmail className="h-4 w-4" />}          label={t("contactMessages.info_email")}     value={message.email} />
          <InfoRow icon={<MdSubject className="h-4 w-4" />}        label={t("contactMessages.info_subject")}   value={message.subject || "—"} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />}  label={t("contactMessages.info_submitted")} value={fmtDate(message.submitted_at)} />
        </div>
      </div>

      {/* ── Message body ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdSubject className="h-5 w-5" />} title={t("contactMessages.section_message")} subtitle={t("contactMessages.section_message_sub")} />
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{message.message}</p>
        </div>
      </div>

      {/* ── Status ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdMailOutline className="h-5 w-5" />} title={t("contactMessages.section_status")} subtitle={t("contactMessages.section_status_sub")} />
        <div className="max-w-xs">
          <SelectField
            label={t("contactMessages.col_status")}
            field="status"
            options={STATUS_OPTIONS}
            formData={statusForm}
            errors={{}}
            updateFormData={handleStatusChange}
            required={false}
          />
          {saving && <p className="text-xs text-slate-400">{t("contactMessages.saving_status")}</p>}
        </div>
      </div>

      <ContactMessageDeleteModal
        open={deleteOpen}
        message={message}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
