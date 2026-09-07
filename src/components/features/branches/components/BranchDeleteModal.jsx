import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const BranchDeleteModal = ({ open, branch, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!branch) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("branches.delete_title")}
      message={
        <>
          {t("branches.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{branch.name}"</span>?{" "}
          {t("branches.delete_confirm_post")}
        </>
      }
      confirmText={t("branches.delete_btn")}
      cancelText={t("branches.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default BranchDeleteModal;
