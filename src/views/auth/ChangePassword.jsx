import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLock, MdCheckCircle } from "react-icons/md";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import Button        from "components/ui/buttons/Button";
import { validate }  from "components/form/utils/validation";
import { usePasswordChange } from "components/features/auth/hooks";

const RULES = {
  old_password: [{ required: true }],
  new_password: [{ required: true }, { minLength: 8 }],
};

export default function ChangePassword() {
  const { t }                                       = useTranslation();
  const { execute: changePassword, loading, error } = usePasswordChange();

  const [formData, setFormData] = useState({ old_password: "", new_password: "" });
  const [errors, setErrors]     = useState({});
  const [done, setDone]         = useState(false);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});
    try {
      await changePassword(formData);
      setDone(true);
    } catch {
      // error handled by usePasswordChange
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdCheckCircle className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">{t("auth.change_done_title")}</h1>
        <p className="mt-2 text-sm text-slate-400">{t("auth.change_done_body")}</p>
        <Button
          onClick={() => { setDone(false); setFormData({ old_password: "", new_password: "" }); }}
          variant="ghost"
          text={t("auth.change_again")}
          className="mt-7 h-11 w-full"
        />
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">
      <div className="mb-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdLock className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">{t("auth.change_title")}</h1>
        <p className="mt-1 text-sm text-slate-400">{t("auth.change_subtitle")}</p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-1">
        <PasswordField label={t("auth.current_password")} field="old_password" placeholder={t("auth.current_password_placeholder")} formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.old_password} />
        <PasswordField label={t("auth.new_password")} field="new_password" placeholder={t("auth.min_chars")} formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.new_password} />

        <Button
          type="submit"
          loading={loading}
          text={t("auth.update_password")}
          className="mt-4 h-12 w-full"
        />
      </form>
    </div>
  );
}
