import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const FeedbackDeleteModal = ({ open, feedback, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!feedback) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("feedbackMessages.delete_title")}
      message={
        <>
          {t("feedbackMessages.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{feedback.full_name}</span>?{" "}
          {t("feedbackMessages.delete_confirm_post")}
        </>
      }
      confirmText={t("feedbackMessages.delete_btn")}
      cancelText={t("feedbackMessages.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default FeedbackDeleteModal;
