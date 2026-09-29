import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLock } from "react-icons/md";
import Modal from "components/ui/modals/Modal";
import PasswordField from "components/form/PasswordField";
import AlertBanner from "components/ui/AlertBanner";
import Button from "components/ui/buttons/Button";
import { validate } from "components/form/utils/validation";
import { usePasswordChange } from "components/features/auth/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  old_password: [{ required: true }],
  new_password: [{ required: true }, { minLength: 8 }],
};
const EMPTY = { old_password: "", new_password: "" };

/**
 * Change-password popup — opened from the profile's Security section and
 * the navbar account menu. Closes with a success toast once the password
 * is updated.
 */
export default function ChangePasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const { execute: changePassword, loading, error } = usePasswordChange();
  const { success } = useToast();
  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const close = () => { setFormData(EMPTY); setErrors({}); onClose(); };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});
    try {
      await changePassword(formData);
      success(t("auth.change_done_title"), t("auth.change_done_body"));
      close();
    } catch {
      // error shown via usePasswordChange's `error`
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t("auth.change_title")}
      subtitle={t("auth.change_subtitle")}
      icon={<MdLock size={20} className="text-green" />}
      footer={
        <div className="flex gap-2">
          <Button variant="ghost" text={t("common.cancel")} onClick={close} disabled={loading} className="flex-1" />
          <Button text={t("auth.update_password")} loading={loading} onClick={handleSubmit} className="flex-1" />
        </div>
      }
    >
      <AlertBanner message={error} />
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <PasswordField label={t("auth.current_password")} field="old_password" placeholder={t("auth.current_password_placeholder")}
          formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.old_password} />
        <PasswordField label={t("auth.new_password")} field="new_password" placeholder={t("auth.min_chars")}
          formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.new_password} />
        {/* lets Enter submit; the visible actions live in the modal footer */}
        <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
      </form>
    </Modal>
  );
}
