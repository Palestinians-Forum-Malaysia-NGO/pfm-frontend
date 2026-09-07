import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const OpportunityApplicationDeleteModal = ({ open, application, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!application) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("opportunityApplications.delete_title")}
      message={
        <>
          {t("opportunityApplications.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{application.applicant_full_name}</span>?{" "}
          {t("opportunityApplications.delete_confirm_post")}
        </>
      }
      confirmText={t("opportunityApplications.delete_btn")}
      cancelText={t("opportunityApplications.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default OpportunityApplicationDeleteModal;
