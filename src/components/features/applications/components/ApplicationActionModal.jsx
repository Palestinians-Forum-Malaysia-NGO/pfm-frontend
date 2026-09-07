import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import Modal from "components/ui/modals/Modal";
import Button from "components/ui/buttons/Button";
import { TextareaField } from "components/form";

const ApplicationActionModal = ({ open, action, application, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  const [note, setNote] = useState("");

  useEffect(() => { if (open) setNote(""); }, [open]);

  if (!application) return null;
  const isApprove = action === "approve";
  const canConfirm = isApprove || note.trim().length >= 10;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isApprove ? t("applications.approve_title") : t("applications.reject_title")}
      subtitle={application.project?.title}
      icon={isApprove
        ? <MdCheckCircle size={20} className="text-green" />
        : <MdCancel size={20} className="text-red-500" />
      }
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" text={t("applications.cancel_btn")} onClick={onClose} disabled={loading} className="flex-1" />
          <Button
            variant={isApprove ? "primary" : "danger"}
            text={isApprove ? t("applications.approve_btn") : t("applications.reject_btn")}
            loading={loading}
            disabled={!canConfirm}
            onClick={() => onConfirm(note)}
            className="flex-1"
          />
        </div>
      }
    >
      <p className="mb-3 text-sm text-slate-600">
        {isApprove ? t("applications.approve_confirm") : t("applications.reject_confirm")}
      </p>
      <TextareaField
        label={isApprove ? t("applications.note_label") : t("applications.reject_reason_label")}
        field="note"
        required={!isApprove}
        rows={3}
        placeholder={isApprove ? t("applications.note_placeholder") : t("applications.reject_reason_placeholder")}
        formData={{ note }}
        errors={{}}
        updateFormData={(_, value) => setNote(value)}
      />
      {!isApprove && <p className="-mt-3 text-xs text-slate-400">{t("applications.reject_reason_hint")}</p>}
    </Modal>
  );
};

export default ApplicationActionModal;
