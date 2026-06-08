import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const StaffDeleteModal = ({ open, staff, onClose, onConfirm, loading }) => {
  if (!staff) return null;

  return (
    <ConfirmModal
      open={open}
      title="Remove Staff Member"
      message={
        <>
          Are you sure you want to remove{" "}
          <span className="font-semibold text-slate-900">{staff.user?.full_name}</span>?{" "}
          This action cannot be undone.
        </>
      }
      confirmText="Remove"
      cancelText="Cancel"
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default StaffDeleteModal;
