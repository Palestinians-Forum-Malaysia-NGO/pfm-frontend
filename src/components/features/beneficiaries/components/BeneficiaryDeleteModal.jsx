import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

const BeneficiaryDeleteModal = ({ open, beneficiary, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  if (!beneficiary) return null;

  return (
    <ConfirmModal
      open={open}
      title={t("beneficiaries.delete_title")}
      message={
        <>
          {t("beneficiaries.delete_confirm_pre")}{" "}
          <span className="font-semibold text-slate-900">{beneficiary.user?.full_name}</span>?{" "}
          {t("beneficiaries.delete_confirm_post")}
        </>
      }
      confirmText={t("beneficiaries.delete_btn")}
      cancelText={t("beneficiaries.cancel_btn")}
      loading={loading}
      icon={<MdWarning size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};

export default BeneficiaryDeleteModal;
