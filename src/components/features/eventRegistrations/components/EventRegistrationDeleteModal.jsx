import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const EventRegistrationDeleteModal = ({ open, registration, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!registration) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("eventRegistrations.delete_title")}
      message={
        <>
          {t("eventRegistrations.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{registration.full_name}</span>?{" "}
          {t("eventRegistrations.delete_confirm_post")}
        </>
      }
      confirmText={t("eventRegistrations.delete_btn")}
      cancelText={t("eventRegistrations.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default EventRegistrationDeleteModal;
