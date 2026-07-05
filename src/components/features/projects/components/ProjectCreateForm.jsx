import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdAssignment, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateProject } from "components/features/projects/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title: [{ required: true }, { maxLength: 255 }],
};

export default function ProjectCreateForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createProject, loading, error } = useCreateProject();
  const { categories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    title: "", title_ar: "",
    cover_image: null,
    category_id: "",
    status: "active",
    summary: "", summary_ar: "",
    description: "", description_ar: "",
    beneficiary_info: "", beneficiary_info_ar: "",
    target: "", start_date: "", end_date: "", is_published: false,
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const STATUS_OPTIONS = [
    { value: "",          label: t("projects.status_select") },
    { value: "active",    label: t("projects.status_active") },
    { value: "completed", label: t("projects.status_completed") },
    { value: "on_hold",   label: t("projects.status_on_hold") },
    { value: "cancelled", label: t("projects.status_cancelled") },
  ];

  const CATEGORY_OPTIONS = [
    { value: "", label: t("projects.category_select") },
    ...categories.map((c) => ({
      value: c.id,
      label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
    })),
  ];

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
      const created = await createProject({
        title:              form.title,
        title_ar:           form.title_ar           || undefined,
        cover_image:        form.cover_image         || undefined,
        category_id:        form.category_id         || undefined,
        status:             form.status              || undefined,
        summary:            form.summary             || undefined,
        summary_ar:         form.summary_ar          || undefined,
        description:        form.description         || undefined,
        description_ar:     form.description_ar      || undefined,
        beneficiary_info:   form.beneficiary_info    || undefined,
        beneficiary_info_ar: form.beneficiary_info_ar || undefined,
        target:             form.target ? Number(form.target) : undefined,
        start_date:         form.start_date          || undefined,
        end_date:           form.end_date            || undefined,
        is_published:       form.is_published,
      });
      success(t("projects.toast_created"), `"${form.title}" ${t("projects.toast_created_sub")}`);
      navigate(`${base}/projects/${created.id}`);
    } catch (err) {
      toastError(t("projects.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("projects.add_title")}
        subtitle={t("projects.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("projects.back")} onClick={() => navigate(`${base}/projects`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("projects.cover_section")} subtitle={t("projects.cover_subtitle")} />
          <StorageCoverField
            folder="projects"
            onUpload={(key) => set("cover_image", key)}
            onRemove={() => set("cover_image", null)}
            errors={errors}
          />
        </div>

        {/* ── Overview ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title={t("projects.overview_section")} subtitle={t("projects.overview_subtitle")} />

          {/* Title EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("projects.title_en")} field="title" placeholder="e.g. Community Aid Programme 2026"
              formData={form} errors={errors} updateFormData={set} rules={RULES.title} />
            <InputField label={t("projects.title_ar_label")} field="title_ar" placeholder={t("projects.title_ar_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>

          {/* Category / Status */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label={t("projects.category_label")} field="category_id" options={CATEGORY_OPTIONS}
              formData={form} errors={errors} updateFormData={set} required={false} />
            <SelectField label={t("projects.status_label")} field="status" options={STATUS_OPTIONS}
              formData={form} errors={errors} updateFormData={set} />
          </div>

          {/* Summary EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField label={t("projects.summary_en")} field="summary" rows={2}
              placeholder="A short one-paragraph summary visible in the project list…"
              required={false} formData={form} errors={errors} updateFormData={set} />
            <TextareaField label={t("projects.summary_ar_label")} field="summary_ar" rows={2}
              placeholder={t("projects.summary_ar_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
        </div>

        {/* ── Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title={t("projects.details_section")} subtitle={t("projects.details_subtitle")} />

          {/* Description EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField label={t("projects.desc_en")} field="description" rows={5}
              placeholder="Full project description…"
              required={false} formData={form} errors={errors} updateFormData={set} />
            <TextareaField label={t("projects.desc_ar_label")} field="description_ar" rows={5}
              placeholder={t("projects.desc_ar_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>

          {/* Beneficiary EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField label={t("projects.beneficiary_en")} field="beneficiary_info" rows={3}
              placeholder="Who will benefit from this project?"
              required={false} formData={form} errors={errors} updateFormData={set} />
            <TextareaField label={t("projects.beneficiary_ar_label")} field="beneficiary_info_ar" rows={3}
              placeholder={t("projects.beneficiary_ar_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
        </div>

        {/* ── Funding & Dates ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title={t("projects.funding_section")} subtitle={t("projects.funding_subtitle")} />
          <InputField label={t("projects.target_label")} field="target" type="number" placeholder="e.g. 50000"
            required={false} formData={form} errors={errors} updateFormData={set} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("projects.start_date")} field="start_date" type="date"
              required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label={t("projects.end_date")} field="end_date" type="date"
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
          <ToggleInput label={t("projects.publish_toggle")} field="is_published" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("projects.cancel")} onClick={() => navigate(`${base}/projects`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("projects.create_btn")} icon={<MdAdd className="h-4 w-4" />}
            loading={loading} disabled={!form.title.trim() || loading} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
