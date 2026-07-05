import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdGroups } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, TextareaField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateClassification } from "components/features/classifications/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [{ required: true }, { maxLength: 255 }],
};

export default function ClassificationCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createClassification, loading, error } = useCreateClassification();
  const { success, error: toastError } = useToast();

  const [form, setForm]     = useState({ name: "", name_ar: "", description: "", description_ar: "" });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const created = await createClassification({
        name:           form.name,
        name_ar:        form.name_ar        || undefined,
        description:    form.description    || undefined,
        description_ar: form.description_ar || undefined,
      });
      success(t("classifications.toast_created"), `"${form.name}" ${t("classifications.toast_created_sub")}`);
      navigate(`${base}/classifications/${created.id}`);
    } catch (err) {
      toastError(t("classifications.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("classifications.add_title")}
        subtitle={t("classifications.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("classifications.back")} onClick={() => navigate(`${base}/classifications`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdGroups className="h-5 w-5" />} title={t("classifications.section_title")} subtitle={t("classifications.section_subtitle_create")} />

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("classifications.name_en")}
              field="name"
              placeholder="e.g. Refugee, Displaced, Asylum Seeker"
              formData={form} errors={errors} updateFormData={set} rules={RULES.name}
            />
            <InputField
              label={t("classifications.name_ar_label")}
              field="name_ar"
              placeholder={t("classifications.name_ar_placeholder")}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField
              label={t("classifications.desc_en")}
              field="description"
              rows={3}
              placeholder="Brief description of this classification…"
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
            <TextareaField
              label={t("classifications.desc_ar_label")}
              field="description_ar"
              rows={3}
              placeholder={t("classifications.desc_ar_placeholder")}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("classifications.cancel")} onClick={() => navigate(`${base}/classifications`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("classifications.create_btn")}
            icon={<MdAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!form.name.trim() || loading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
