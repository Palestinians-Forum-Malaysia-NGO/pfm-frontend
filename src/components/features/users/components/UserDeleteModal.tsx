// @ts-nocheck
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
  if (!user) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete User"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{user.name}</span>?{" "}
          This action cannot be undone.
        </>
      }
      confirmText="Delete"
      cancelText="Cancel"
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default DeleteUserModal;
