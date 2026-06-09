import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const CategoryDeleteModal = ({ open, category, onClose, onConfirm, loading }) => {
  if (!category) return null;
  return (
    <ConfirmModal
      open={open}
      title="Delete Category"
      message={
        <>
          Are you sure you want to delete{" "}
          <span className="font-semibold text-slate-900">"{category.name}"</span>?{" "}
          The category will be deactivated and hidden from members.
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

export default CategoryDeleteModal;
