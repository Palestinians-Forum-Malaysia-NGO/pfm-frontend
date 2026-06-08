import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const MemberDeleteModal = ({ open, member, onClose, onConfirm, loading }) => {
  if (!member) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Member"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{member.user?.full_name}</span>?{" "}
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

export default MemberDeleteModal;
