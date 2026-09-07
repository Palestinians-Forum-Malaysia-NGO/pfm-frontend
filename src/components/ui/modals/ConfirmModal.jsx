import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import Button from "components/ui/buttons/Button";

/**
 * Confirmation dialog built on top of Modal.
 *
 * Props:
 *   open          – boolean
 *   onClose       – () => void
 *   onConfirm     – () => void
 *   title         – string
 *   subtitle      – string (optional)
 *   message       – string | ReactNode
 *   icon          – ReactNode (optional)
 *   confirmText   – string  (default "Confirm")
 *   cancelText    – string  (default "Cancel")
 *   confirmVariant – Button variant (default "danger")
 *   loading       – boolean
 */
const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  subtitle,
  message,
  icon,
  confirmText,
  cancelText,
  confirmVariant = "danger",
  loading        = false,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      size="sm"
      footer={
        <div className="flex gap-2">
          <Button
            variant="ghost"
            text={cancelText ?? t("common.cancel")}
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          />
          <Button
            variant={confirmVariant}
            text={confirmText ?? t("common.confirm")}
            loading={loading}
            onClick={onConfirm}
            className="flex-1"
          />
        </div>
      }
    >
      <p className="text-sm text-slate-600">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
