import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdGroups } from "react-icons/md";
import PageHeader  from "components/ui/PageHeader";
import { InputField, TextareaField, validate } from "components/form";
import Button      from "components/ui/buttons/Button";
import FormHeader  from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading     from "components/loading/Loading";
import { useGetClassification, useUpdateClassification } from "components/features/classifications/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [{ required: true }, { maxLength: 255 }],
};

export default function ClassificationEditForm() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: fetchClassification, loading, error: loadError } = useGetClassification();
  const { execute: updateClassification, loading: saving, error: saveError } = useUpdateClassification();
  const { success, error: toastError } = useToast();

  const [form, setForm]       = useState({ name: "", name_ar: "", description: "", description_ar: "" });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  useEffect(() => {
    fetchClassification(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:           data.name           ?? "",
        name_ar:        data.name_ar        ?? "",
        description:    data.description    ?? "",
        description_ar: data.description_ar ?? "",
      };
      setForm(snapshot);
      setInitial(snapshot);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }
    setErrors({});

    try {
      await updateClassification(id, {
        name:           form.name,
        name_ar:        form.name_ar        || undefined,
        description:    form.description    || undefined,
        description_ar: form.description_ar || undefined,
      });
      success(t("classifications.toast_updated"), `"${form.name}" ${t("classifications.toast_updated_sub")}`);
      navigate(`${base}/classifications/${id}`);
    } catch (err) {
      toastError(t("classifications.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text="Loading classification…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("classifications.edit_title")}
        subtitle={form.name || t("classifications.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("classifications.back_to_classification")} onClick={() => navigate(`${base}/classifications/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdGroups className="h-5 w-5" />} title={t("classifications.section_title")} subtitle={t("classifications.section_subtitle_edit")} />

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
          <Button variant="ghost" text={t("classifications.cancel")} onClick={() => navigate(`${base}/classifications/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("classifications.save_btn")}
            loading={saving}
            disabled={!form.name.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
