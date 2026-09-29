import { useTranslation } from "react-i18next";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

// Built on the shared ConfirmModal (rendered into document.body), so it
// always opens centred on screen regardless of where the page is scrolled.
export default function ProjectDeleteModal({ open, project, onClose, onConfirm, loading }) {
  const { t } = useTranslation();
  return (
    <ConfirmModal
      open={open}
      title={t("projects.delete_title")}
      message={
        <>
          {t("projects.delete_msg")}{" "}
          <span className="font-semibold text-slate-900">"{project?.title}"</span>?{" "}
          {t("projects.delete_msg_post")}
        </>
      }
      confirmText={t("projects.delete_btn")}
      cancelText={t("projects.cancel_btn")}
      loading={loading}
      icon={<MdDeleteOutline size={20} className="text-red-500" />}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}
