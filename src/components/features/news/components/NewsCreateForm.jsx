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
import { useCreateNews } from "components/features/news/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title: [{ required: true }, { maxLength: 255 }],
};

export default function NewsCreateForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createNews, loading, error } = useCreateNews();
  const { categories } = useGetCategories({ module: "blogs" });
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    title: "",
    cover_image: null,
    category: "",
    excerpt: "",
    content: "",
    is_published: false, is_featured: false,
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const CATEGORY_OPTIONS = [
    { value: "", label: t("news.category_select") },
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
      const created = await createNews({
        title:        form.title,
        cover_image:  form.cover_image   || undefined,
        category:     form.category     || undefined,
        excerpt:      form.excerpt      || undefined,
        content:      form.content      || undefined,
        is_published: form.is_published,
        is_featured:  form.is_featured,
      });
      success(t("news.toast_created"), `"${form.title}" ${t("news.toast_created_sub")}`);
      navigate(`${base}/news/${created.id}`);
    } catch (err) {
      toastError(t("news.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("news.add_title")}
        subtitle={t("news.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("news.back")} onClick={() => navigate(`${base}/news`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("news.cover_section")} subtitle={t("news.cover_subtitle")} />
          <StorageCoverField
            folder="news"
            onUpload={(key) => set("cover_image", key)}
            onRemove={() => set("cover_image", null)}
            errors={errors}
          />
        </div>

        {/* ── Overview ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("news.overview_section")} subtitle={t("news.overview_subtitle")} />

          <InputField label={t("news.title_en")} field="title" placeholder="e.g. PFM Launches New Aid Campaign"
            formData={form} errors={errors} updateFormData={set} rules={RULES.title} />

          <SelectField label={t("news.category_label")} field="category" options={CATEGORY_OPTIONS}
            formData={form} errors={errors} updateFormData={set} required={false} />

          <TextareaField label={t("news.excerpt_en")} field="excerpt" rows={2}
            placeholder={t("news.excerpt_en_placeholder")}
            required={false} formData={form} errors={errors} updateFormData={set} />

          <p className="-mt-2 mb-4 text-xs text-slate-400">{t("news.auto_translate_hint")}</p>
        </div>

        {/* ── Content ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("news.content_section")} subtitle={t("news.content_subtitle")} />
          <TextareaField label={t("news.content_en")} field="content" rows={8}
            placeholder={t("news.content_en_placeholder")}
            required={false} formData={form} errors={errors} updateFormData={set} />
        </div>

        {/* ── Publishing ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdArticle className="h-5 w-5" />} title={t("news.publishing_section")} subtitle={t("news.publishing_subtitle")} />
          <ToggleInput label={t("news.publish_toggle")} field="is_published" formData={form} errors={errors} updateFormData={set} />
          <ToggleInput label={t("news.featured_toggle")} field="is_featured" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("news.cancel")} onClick={() => navigate(`${base}/news`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("news.create_btn")} icon={<MdAdd className="h-4 w-4" />}
            loading={loading} disabled={!form.title.trim() || loading} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
