import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const UserDeleteModal = ({ open, user, onClose, onConfirm, loading }) => {
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

export default UserDeleteModal;
