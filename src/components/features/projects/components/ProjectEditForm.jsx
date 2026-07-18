import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdAssignment, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetProject, useUpdateProject } from "components/features/projects/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title: [{ required: true }, { maxLength: 255 }],
};

export default function ProjectEditForm() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { project, execute: fetchProject, loading, error: loadError } = useGetProject();
  const { execute: updateProject, loading: saving, error: saveError }  = useUpdateProject();
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
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});
  const [coverKey, setCoverKey] = useState(null);
  const { url: currentCoverUrl } = useStorageUrl(coverKey);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

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

  useEffect(() => {
    fetchProject(id).then((data) => {
      if (!data) return;
      const snap = {
        title:              data.title              ?? "",
        title_ar:           data.title_ar           ?? "",
        cover_image:        null,
        category_id:        categories.find((c) => c.slug === data.category?.slug)?.id ?? "",
        status:             data.status             ?? "active",
        summary:            data.summary            ?? "",
        summary_ar:         data.summary_ar         ?? "",
        description:        data.description        ?? "",
        description_ar:     data.description_ar     ?? "",
        beneficiary_info:   data.beneficiary_info   ?? "",
        beneficiary_info_ar: data.beneficiary_info_ar ?? "",
        target:             data.target != null ? String(data.target) : "",
        start_date:         data.start_date  ? data.start_date.slice(0, 10)  : "",
        end_date:           data.end_date    ? data.end_date.slice(0, 10)    : "",
        is_published:       data.is_published ?? false,
      };
      setCoverKey(data.cover_image ?? null);
      setForm(snap);
      setInitial(snap);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // categories may finish loading after the project snapshot above already ran —
  // backfill category_id once both are available, unless the user already picked one.
  useEffect(() => {
    if (form.category_id || !project?.category?.slug || categories.length === 0) return;
    const match = categories.find((c) => c.slug === project.category.slug);
    if (!match) return;
    setForm((p) => ({ ...p, category_id: match.id }));
    setInitial((p) => p ? { ...p, category_id: match.id } : p);
  }, [project, categories]); // eslint-disable-line react-hooks/exhaustive-deps

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
      const payload = {
        title:              form.title,
        title_ar:           form.title_ar           || undefined,
        category_id:        form.category_id        || undefined,
        status:             form.status             || undefined,
        summary:            form.summary            || undefined,
        summary_ar:         form.summary_ar         || undefined,
        description:        form.description        || undefined,
        description_ar:     form.description_ar     || undefined,
        beneficiary_info:   form.beneficiary_info   || undefined,
        beneficiary_info_ar: form.beneficiary_info_ar || undefined,
        target:             form.target ? Number(form.target) : undefined,
        start_date:         form.start_date         || undefined,
        end_date:           form.end_date           || undefined,
        is_published:       form.is_published,
        ...(form.cover_image !== null ? { cover_image: form.cover_image || null } : {}),
      };
      await updateProject(id, payload);
      success(t("projects.toast_updated"), `"${form.title}" ${t("projects.toast_updated_sub")}`);
      navigate(`${base}/projects/${id}`);
    } catch (err) {
      toastError(t("projects.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("projects.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("projects.edit_title")}
        subtitle={form.title || t("projects.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("projects.back_to_project")} onClick={() => navigate(`${base}/projects/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("projects.cover_section")} subtitle={t("projects.cover_subtitle")} />
          <StorageCoverField
            folder="projects"
            currentUrl={currentCoverUrl}
            onUpload={(key) => { set("cover_image", key); setCoverKey(null); }}
            onRemove={() => { set("cover_image", ""); setCoverKey(null); }}
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

          {project?.slug && (
            <div className="mb-3 mt-1">
              <p className="mb-1 text-xs font-medium text-slate-400">{t("projects.slug_label")}</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{project.slug}</p>
            </div>
          )}

          {/* Summary EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField label={t("projects.summary_en")} field="summary" rows={2}
              placeholder={t("projects.summary_en_placeholder")}
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
              placeholder={t("projects.desc_en_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
            <TextareaField label={t("projects.desc_ar_label")} field="description_ar" rows={5}
              placeholder={t("projects.desc_ar_placeholder")}
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>

          {/* Beneficiary EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField label={t("projects.beneficiary_en")} field="beneficiary_info" rows={3}
              placeholder={t("projects.beneficiary_en_placeholder")}
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
          <ToggleInput label={t("projects.publish_toggle_edit")} field="is_published" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("projects.cancel")} onClick={() => navigate(`${base}/projects/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("projects.save_btn")}
            loading={saving} disabled={!form.title.trim() || !isDirty || saving} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
