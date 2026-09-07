import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const EventDeleteModal = ({ open, event, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!event) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("events.delete_title")}
      message={
        <>
          {t("events.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{event.title}"</span>?{" "}
          {t("events.delete_confirm_post")}
        </>
      }
      confirmText={t("events.delete_btn")}
      cancelText={t("events.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default EventDeleteModal;
