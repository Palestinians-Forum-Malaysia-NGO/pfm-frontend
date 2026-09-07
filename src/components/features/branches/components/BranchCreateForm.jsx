import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdArrowBack, MdAdd, MdBusiness } from "react-icons/md";
import useLayoutBase from "hooks/useLayoutBase";
import PageHeader   from "components/ui/PageHeader";
import { InputField, ToggleInput, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import { useCreateBranch } from "components/features/branches/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name:    [{ required: true }, { maxLength: 150 }],
  name_ar: [{ required: true }, { maxLength: 150 }],
};

const EMPTY = { name: "", name_ar: "", is_active: true };

export default function BranchCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createBranch, loading, error } = useCreateBranch();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState(EMPTY);
  const [errors, setErrors]     = useState({});

  const updateFormData = (field, value) => setFormData((p) => ({ ...p, [field]: value }));

  const canSubmit = !Object.entries(RULES).some(([field, rules]) => !!validate(formData[field], rules));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(formData[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const created = await createBranch({
        name:      formData.name,
        name_ar:   formData.name_ar,
        is_active: formData.is_active,
      });
      success(t("branches.toast_created"), `${formData.name} ${t("branches.toast_created_sub")}`);
      navigate(`${base}/branches/${created.id}`);
    } catch (err) {
      toastError(t("branches.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col rounded-2xl border border-slate-200 bg-white">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("branches.add_title")}
        subtitle={t("branches.add_subtitle")}
        className="p-6 border-b border-slate-200"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("branches.back")} onClick={() => navigate(`${base}/branches`)} />
        }
      />

      <AlertBanner message={error} className="p-6 border-b border-slate-200" />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col">

        <div className="bg-white p-6 border-b border-slate-200">
          <FormHeader icon={<MdBusiness className="h-5 w-5" />} title={t("branches.section_info")} subtitle={t("branches.section_info_sub")} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("branches.info_name")} field="name" placeholder="Kuala Lumpur HQ"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name}
            />
            <InputField
              label={t("branches.info_name_ar")} field="name_ar" placeholder="المقر الرئيسي كوالالمبور"
              formData={formData} errors={errors} updateFormData={updateFormData} rules={RULES.name_ar}
            />
          </div>
          <ToggleInput label={t("branches.info_active")} field="is_active" formData={formData} errors={errors} updateFormData={updateFormData} />
        </div>

        <div className="flex gap-3 p-6">
          <Button variant="ghost" text={t("branches.cancel")} onClick={() => navigate(`${base}/branches`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text={t("branches.create_btn")}
            icon={<MdAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!canSubmit || loading}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
