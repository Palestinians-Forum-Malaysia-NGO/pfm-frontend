import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const ClassificationDeleteModal = ({ open, classification, onClose, onConfirm, loading }) => {
  if (!classification) return null;
  return (
    <ConfirmModal
      open={open}
      title="Delete Classification"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">"{classification.name}"</span>?{" "}
          Beneficiaries assigned to this classification will lose their classification tag.
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

export default ClassificationDeleteModal;
