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
import { useGetNewsArticle, useUpdateNews } from "components/features/news/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title: [{ required: true }, { maxLength: 255 }],
};

export default function NewsEditForm() {
  const { t, i18n } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { article, execute: fetchArticle, loading, error: loadError } = useGetNewsArticle();
  const { execute: updateNews, loading: saving, error: saveError }    = useUpdateNews();
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
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});
  const [coverKey, setCoverKey] = useState(null);
  const { url: currentCoverUrl } = useStorageUrl(coverKey);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  const CATEGORY_OPTIONS = [
    { value: "", label: t("news.category_select") },
    ...categories.map((c) => ({
      value: c.id,
      label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
    })),
  ];

  useEffect(() => {
    fetchArticle(id).then((data) => {
      if (!data) return;
      const snap = {
        title:        data.title        ?? "",
        cover_image:  null,
        category:     data.category?.id ?? "",
        excerpt:      data.excerpt      ?? "",
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
        category:     form.category     || undefined,
        excerpt:      form.excerpt      || undefined,
        content:      form.content      || undefined,
        is_published: form.is_published,
        is_featured:  form.is_featured,
        ...(form.cover_image !== null ? { cover_image: form.cover_image || null } : {}),
      };
      await updateNews(id, payload);
      success(t("news.toast_updated"), `"${form.title}" ${t("news.toast_updated_sub")}`);
      navigate(`${base}/news/${id}`);
    } catch (err) {
      toastError(t("news.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("news.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("news.edit_title")}
        subtitle={form.title || t("news.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("news.back_to_article")} onClick={() => navigate(`${base}/news/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("news.cover_section")} subtitle={t("news.cover_subtitle")} />
          <StorageCoverField
            folder="news"
            currentUrl={currentCoverUrl}
            onUpload={(key) => { set("cover_image", key); setCoverKey(null); }}
            onRemove={() => { set("cover_image", ""); setCoverKey(null); }}
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

          {article?.slug && (
            <div className="mb-3 mt-1">
              <p className="mb-1 text-xs font-medium text-slate-400">{t("news.slug_label")}</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{article.slug}</p>
            </div>
          )}

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
          <Button variant="ghost" text={t("news.cancel")} onClick={() => navigate(`${base}/news/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("news.save_changes")}
            loading={saving} disabled={!isDirty || saving} className="flex-1" />
        </div>
      </form>
    </div>
  );
}
