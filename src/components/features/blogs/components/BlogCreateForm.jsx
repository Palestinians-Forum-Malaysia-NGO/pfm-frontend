import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdArticle, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateBlog } from "components/features/blogs/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title:   [{ required: true }, { maxLength: 255 }],
  summary: [{ required: true }],
  content: [{ required: true }],
};

export default function BlogCreateForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createBlog, loading, error } = useCreateBlog();
  const { categories } = useGetCategories({ module: "posts" });
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    title: "",
    cover_image: null,
    category_id: "",
    summary: "",
    content: "",
    is_published: false, is_featured: false,
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const CATEGORY_OPTIONS = [
    { value: "", label: t("blogs.category_select") },
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
      const created = await createBlog({
        title:        form.title,
        cover_image:  form.cover_image  || undefined,
        category_id:  form.category_id  || undefined,
        summary:      form.summary,
        content:      form.content,
        is_published: form.is_published,
        is_featured:  form.is_featured,
      });
      success(t("blogs.toast_created"), `"${form.title}" ${t("blogs.toast_created_sub")}`);
      navigate(`${base}/blogs/${created.id}`);
    } catch (err) {
      toastError(t("blogs.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("blogs.add_title")}
        subtitle={t("blogs.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("blogs.back")} onClick={() => navigate(`${base}/blogs`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("blogs.cover_section")} subtitle={t("blogs.cover_subtitle")} />
          <StorageCoverField
            folder="blogs"
            onUpload={(key) => set("cover_image", key)}
            onRemove={() => set("cover_image", null)}
            errors={errors}
          />
        </div>

        {/* ── Overview ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("blogs.overview_section")} subtitle={t("blogs.overview_subtitle")} />

          <InputField label={t("blogs.title_en")} field="title" placeholder="e.g. A Volunteer's First Month with PFM"
            formData={form} errors={errors} updateFormData={set} rules={RULES.title} />

          <SelectField label={t("blogs.category_label")} field="category_id" options={CATEGORY_OPTIONS}
            formData={form} errors={errors} updateFormData={set} required={false} />

          <TextareaField label={t("blogs.summary_en")} field="summary" rows={2}
            placeholder={t("blogs.summary_en_placeholder")}
            formData={form} errors={errors} updateFormData={set} rules={RULES.summary} />

          <p className="-mt-2 mb-4 text-xs text-slate-400">{t("blogs.auto_translate_hint")}</p>
        </div>

        {/* ── Content ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("blogs.content_section")} subtitle={t("blogs.content_subtitle")} />
          <TextareaField label={t("blogs.content_en")} field="content" rows={8}
            placeholder={t("blogs.content_en_placeholder")}
            formData={form} errors={errors} updateFormData={set} rules={RULES.content} />
        </div>

        {/* ── Publishing ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("blogs.publishing_section")} subtitle={t("blogs.publishing_subtitle")} />
          <ToggleInput label={t("blogs.publish_toggle")} field="is_published" formData={form} errors={errors} updateFormData={set} />
          <ToggleInput label={t("blogs.featured_toggle")} field="is_featured" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("blogs.cancel")} onClick={() => navigate(`${base}/blogs`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("blogs.create_btn")} icon={<MdAdd className="h-4 w-4" />}
            loading={loading} disabled={!form.title.trim() || !form.summary.trim() || !form.content.trim() || loading} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
