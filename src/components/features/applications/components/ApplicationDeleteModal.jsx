import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const ApplicationDeleteModal = ({ open, application, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!application) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("applications.delete_title")}
      message={
        <>
          {t("applications.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{application.user?.full_name ?? application.beneficiary?.user?.full_name}"</span>{" "}
          {t("applications.delete_confirm_mid")}{" "}
          <span className="font-semibold text-slate-900">"{application.project?.title}"</span>?{" "}
          {t("applications.delete_confirm_post")}
        </>
      }
      confirmText={t("applications.delete_btn")}
      cancelText={t("applications.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default ApplicationDeleteModal;
