import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdArticle, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetBlog, useUpdateBlog } from "components/features/blogs/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title:   [{ required: true }, { maxLength: 255 }],
  summary: [{ required: true }],
  content: [{ required: true }],
};

export default function BlogEditForm() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { blog, execute: fetchBlog, loading, error: loadError } = useGetBlog();
  const { execute: updateBlog, loading: saving, error: saveError } = useUpdateBlog();
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
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});
  const [coverKey, setCoverKey] = useState(null);
  const { url: currentCoverUrl } = useStorageUrl(coverKey);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  const CATEGORY_OPTIONS = [
    { value: "", label: t("blogs.category_select") },
    ...categories.map((c) => ({
      value: c.id,
      label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
    })),
  ];

  useEffect(() => {
    fetchBlog(id).then((data) => {
      if (!data) return;
      const snap = {
        title:        data.title        ?? "",
        cover_image:  null,
        category_id:  data.category?.id ?? "",
        summary:      data.summary      ?? "",
        content:      data.content      ?? "",
        is_published: data.is_published ?? false,
        is_featured:  data.is_featured  ?? false,
      };
      setCoverKey(data.cover_image ?? null);
      setForm(snap);
      setInitial(snap);
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
      const payload = {
        title:        form.title,
        category_id:  form.category_id || undefined,
        summary:      form.summary,
        content:      form.content,
        is_published: form.is_published,
        is_featured:  form.is_featured,
        ...(form.cover_image !== null ? { cover_image: form.cover_image || null } : {}),
      };
      await updateBlog(id, payload);
      success(t("blogs.toast_updated"), `"${form.title}" ${t("blogs.toast_updated_sub")}`);
      navigate(`${base}/blogs/${id}`);
    } catch (err) {
      toastError(t("blogs.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("blogs.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("blogs.edit_title")}
        subtitle={form.title || t("blogs.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("blogs.back_to_blog")} onClick={() => navigate(`${base}/blogs/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("blogs.cover_section")} subtitle={t("blogs.cover_subtitle")} />
          <StorageCoverField
            folder="blogs"
            currentUrl={currentCoverUrl}
            onUpload={(key) => { set("cover_image", key); setCoverKey(null); }}
            onRemove={() => { set("cover_image", ""); setCoverKey(null); }}
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

          {blog?.slug && (
            <div className="mb-3 mt-1">
              <p className="mb-1 text-xs font-medium text-slate-400">{t("blogs.slug_label")}</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{blog.slug}</p>
            </div>
          )}

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
          <Button variant="ghost" text={t("blogs.cancel")} onClick={() => navigate(`${base}/blogs/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("blogs.save_changes")}
            loading={saving} disabled={!isDirty || saving} className="flex-1" />
        </div>
      </form>
    </div>
  );
}
