import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const StaffDeleteModal = ({ open, staff, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!staff) return null;

  return (
    <ConfirmModal
      open={open}
      title={t("staff.delete_title")}
      message={
        <>
          {t("staff.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{staff.user?.full_name}</span>?{" "}
          {t("staff.delete_confirm_post")}
        </>
      }
      confirmText={t("staff.delete_btn")}
      cancelText={t("staff.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default StaffDeleteModal;
