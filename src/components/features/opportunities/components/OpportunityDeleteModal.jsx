import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const OpportunityDeleteModal = ({ open, opportunity, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!opportunity) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("opportunities.delete_title")}
      message={
        <>
          {t("opportunities.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{opportunity.title}"</span>?{" "}
          {t("opportunities.delete_confirm_post")}
        </>
      }
      confirmText={t("opportunities.delete_btn")}
      cancelText={t("opportunities.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default OpportunityDeleteModal;
