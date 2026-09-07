import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const ClassificationDeleteModal = ({ open, classification, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!classification) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("classifications.delete_title")}
      message={
        <>
          {t("classifications.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{classification.name}"</span>?{" "}
          {t("classifications.delete_confirm_post")}
        </>
      }
      confirmText={t("classifications.delete_btn")}
      cancelText={t("classifications.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default ClassificationDeleteModal;
