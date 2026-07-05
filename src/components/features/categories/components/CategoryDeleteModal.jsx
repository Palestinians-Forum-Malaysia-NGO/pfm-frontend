import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const CategoryDeleteModal = ({ open, category, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!category) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("categories.delete_title")}
      message={
        <>
          {t("categories.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{category.name}"</span>?{" "}
          {t("categories.delete_confirm_post")}
        </>
      }
      confirmText={t("categories.delete_btn")}
      cancelText={t("categories.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default CategoryDeleteModal;
