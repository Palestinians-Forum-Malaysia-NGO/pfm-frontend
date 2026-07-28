import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLockReset, MdArrowBack, MdCheckCircle } from "react-icons/md";
import PasswordField from "components/form/PasswordField";
import AlertBanner   from "components/ui/AlertBanner";
import Button        from "components/ui/buttons/Button";
import { validate }  from "components/form/utils/validation";
import { useResetPassword } from "components/features/auth/hooks";

const PASSWORD_RULES = [
  { required: true },
  { minLength: 8 },
];

export default function ResetPassword() {
  const { t }                                       = useTranslation();
  const navigate                                    = useNavigate();
  const [searchParams]                              = useSearchParams();
  const urlToken                                    = searchParams.get("token") ?? "";

  const { execute: resetPassword, loading, error }  = useResetPassword();

  const [token, setToken]       = useState(urlToken);
  const [formData, setFormData] = useState({ password: "" });
  const [errors, setErrors]     = useState({});
  const [done, setDone]         = useState(false);

  const updateFormData = (field, value) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!token.trim()) newErrors.token = t("auth.reset_token_required");
    const pwErr = validate(formData.password, PASSWORD_RULES);
    if (pwErr) newErrors.password = pwErr;
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    setErrors({});
    try {
      await resetPassword({ token: token.trim(), password: formData.password });
      setDone(true);
    } catch {
      // error handled by useResetPassword
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green/10">
          <MdCheckCircle className="h-8 w-8 text-green" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-navy-700">{t("auth.reset_done_title")}</h1>
        <p className="mt-2 text-sm text-slate-400">{t("auth.reset_done_body")}</p>
        <Link
          to="/auth/sign-in"
          className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-green text-sm font-semibold text-white shadow-sm shadow-green/20 transition-all duration-200 hover:bg-[#006833] active:scale-[0.98]"
        >
          {t("auth.sign_in")}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-100">

      <div className="mb-7">
        <Link
          to="/auth/forgot-password"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          <MdArrowBack className="h-4 w-4" /> {t("auth.back")}
        </Link>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green/10">
          <MdLockReset className="h-6 w-6 text-green" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-700">{t("auth.reset_title")}</h1>
        <p className="mt-1 text-sm text-slate-400">{t("auth.reset_subtitle")}</p>
      </div>

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Token input — hidden if received via URL param */}
        {!urlToken && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-700">{t("auth.reset_token")}</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("auth.reset_token_placeholder")}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm text-start text-slate-800 outline-none transition-all duration-200 ${
                errors.token
                  ? "border-red-300 bg-red-50"
                  : "border-slate-200 bg-slate-50 focus:border-green focus:bg-white"
              }`}
            />
            {errors.token && <p className="mt-1 text-xs text-red-500">{errors.token}</p>}
          </div>
        )}

        <PasswordField
          label={t("auth.new_password")} field="password"
          placeholder={t("auth.min_chars")}
          formData={formData} errors={errors}
          updateFormData={updateFormData} rules={PASSWORD_RULES}
        />

        <Button
          type="submit"
          loading={loading}
          text={t("auth.reset_btn")}
          className="h-12 w-full"
        />
      </form>

      <p className="mt-5 text-center text-sm text-slate-400">
        {t("auth.no_email")}{" "}
        <Link to="/auth/forgot-password" className="font-medium text-green transition-colors hover:text-[#006833]">
          {t("auth.try_again")}
        </Link>
      </p>
    </div>
  );
}
