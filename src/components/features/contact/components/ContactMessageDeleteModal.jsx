import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const ContactMessageDeleteModal = ({ open, message, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!message) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("contactMessages.delete_title")}
      message={
        <>
          {t("contactMessages.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{message.subject}"</span>{" "}
          {t("contactMessages.delete_confirm_from")} {message.full_name}?{" "}
          {t("contactMessages.delete_confirm_post")}
        </>
      }
      confirmText={t("contactMessages.delete_btn")}
      cancelText={t("contactMessages.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default ContactMessageDeleteModal;
