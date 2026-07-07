// @ts-nocheck
import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import type { User } from "types/auth";
import ConfirmModal from "components/ui/modals/ConfirmModal";

interface DeleteUserModalProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading: boolean;
}

const DeleteUserModal = ({ open, user, onClose, onConfirm, loading }: DeleteUserModalProps) => {
  const { t } = useTranslation();
  if (!user) return null;

  return (
    <ConfirmModal
      open={open}
      title={t("users.delete_title")}
      message={
        <>
          {t("users.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{user.name}</span>?{" "}
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

export default DeleteUserModal;
