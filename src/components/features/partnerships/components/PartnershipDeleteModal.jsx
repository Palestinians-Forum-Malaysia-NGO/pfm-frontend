import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const PartnershipDeleteModal = ({ open, partnership, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!partnership) return null;
  return (
    <ConfirmModal
      open={open}
      title={t("partnerships.delete_title")}
      message={
        <>
          {t("partnerships.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">"{partnership.name}"</span>?{" "}
          {t("partnerships.delete_confirm_post")}
        </>
      }
      confirmText={t("partnerships.delete_btn")}
      cancelText={t("partnerships.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default PartnershipDeleteModal;
