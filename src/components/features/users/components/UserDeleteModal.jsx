import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const UserDeleteModal = ({ open, user, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <ConfirmModal
      open={open}
      title={t("users.delete_title")}
      message={
        <>
          {t("users.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{user.full_name}</span>?{" "}
          {t("users.delete_confirm_post")}
        </>
      }
      confirmText={t("users.delete_btn")}
      cancelText={t("users.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default UserDeleteModal;
