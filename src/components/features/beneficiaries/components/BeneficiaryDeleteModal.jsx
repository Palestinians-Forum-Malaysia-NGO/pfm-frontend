import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const BeneficiaryDeleteModal = ({ open, beneficiary, onClose, onConfirm, loading }) => {
  if (!beneficiary) return null;

  return (
    <ConfirmModal
      open={open}
      title="Delete Beneficiary"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">{beneficiary.user?.full_name}</span>?{" "}
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

export default BeneficiaryDeleteModal;
