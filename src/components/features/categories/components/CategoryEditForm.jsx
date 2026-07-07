import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdCategory } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, TextareaField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetCategory, useUpdateCategory, useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [{ required: true }, { maxLength: 255 }],
};

export default function CategoryEditForm() {
  const { t, i18n } = useTranslation();
  const MODULE_OPTIONS = [
    { value: "beneficiaries", label: t("categories.module_beneficiaries") },
    { value: "projects",      label: t("categories.module_projects") },
    { value: "blogs",         label: t("categories.module_blogs") },
    { value: "donations",     label: t("categories.module_donations") },
    { value: "campaigns",     label: t("categories.module_campaigns") },
  ];
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { category, execute: fetchCategory, loading, error: loadError } = useGetCategory();
  const { execute: updateCategory, loading: saving, error: saveError }  = useUpdateCategory();
  const { categories: allCategories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: "", name_ar: "", module: "",
    description: "", description_ar: "",
    parent: "", order: "", hex_color: "", text_color: "", is_active: true,
  });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  const parentOptions = allCategories
    .filter((c) => c.id !== id)
    .map((c) => ({
      value: c.id,
      label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
    }));

  useEffect(() => {
    fetchCategory(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:           data.name           ?? "",
        name_ar:        data.name_ar        ?? "",
        module:         data.module         ?? "",
        description:    data.description    ?? "",
        description_ar: data.description_ar ?? "",
        parent:         data.parent         ?? "",
        order:          data.order != null ? String(data.order) : "",
        hex_color:      data.hex_color      ?? "",
        text_color:     data.text_color     ?? "",
        is_active:      data.is_active      ?? true,
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
      await updateCategory(id, {
        name:           form.name,
        name_ar:        form.name_ar        || undefined,
        module:         form.module         || undefined,
        description:    form.description    || undefined,
        description_ar: form.description_ar || undefined,
        parent:         form.parent         || undefined,
        order:          form.order !== "" ? Number(form.order) : undefined,
        hex_color:      form.hex_color      || undefined,
        text_color:     form.text_color     || undefined,
        is_active:      form.is_active,
      });
      success(t("categories.toast_updated"), `"${form.name}" ${t("categories.toast_updated_sub")}`);
      navigate(`${base}/categories/${id}`);
    } catch (err) {
      toastError(t("categories.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("categories.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("categories.edit_title")}
        subtitle={form.name || t("categories.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("categories.back_to_category")} onClick={() => navigate(`${base}/categories/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCategory className="h-5 w-5" />} title={t("categories.section_title")} subtitle={t("categories.section_subtitle_edit")} />

          {/* Name EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label={t("categories.name_en")}
              field="name"
              placeholder="e.g. General Member"
              formData={form} errors={errors} updateFormData={set} rules={RULES.name}
            />
            <InputField
              label={t("categories.name_ar_label")}
              field="name_ar"
              placeholder={t("categories.name_ar_placeholder")}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>

          {/* Module */}
          <SelectField
            label={t("categories.module")}
            field="module"
            options={MODULE_OPTIONS}
            required={false}
            formData={form} errors={errors} updateFormData={set}
          />

          {/* Description EN / AR */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField
              label={t("categories.desc_en")}
              field="description"
              placeholder={t("categories.desc_en_placeholder")}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
            <TextareaField
              label={t("categories.desc_ar_label")}
              field="description_ar"
              placeholder={t("categories.desc_ar_placeholder")}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>

          {/* Parent / Order */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField
              label={t("categories.parent")}
              field="parent"
              options={parentOptions}
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
            <InputField
              label={t("categories.order")}
              field="order"
              type="number"
              placeholder="0"
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-900">{t("categories.bg_color")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.hex_color || "#ffffff"}
                  onChange={(e) => set("hex_color", e.target.value)}
                  className="h-12 w-12 flex-shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-1"
                />
                <input
                  type="text"
                  value={form.hex_color}
                  onChange={(e) => set("hex_color", e.target.value)}
                  placeholder="#007A3D"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green focus:bg-slate-100/70"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-900">{t("categories.text_color_label")}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={form.text_color || "#ffffff"}
                  onChange={(e) => set("text_color", e.target.value)}
                  className="h-12 w-12 flex-shrink-0 cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-1"
                />
                <input
                  type="text"
                  value={form.text_color}
                  onChange={(e) => set("text_color", e.target.value)}
                  placeholder="#ffffff"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-green focus:bg-slate-100/70"
                />
              </div>
            </div>
          </div>

          {category?.slug && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-slate-400">{t("categories.slug_label")}</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{category.slug}</p>
            </div>
          )}

          <ToggleInput label={t("categories.active")} field="is_active" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("categories.cancel")} onClick={() => navigate(`${base}/categories/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("categories.save_btn")} loading={saving} disabled={!form.name.trim() || !isDirty || saving} className="flex-1" />
        </div>
      </form>
    </div>
  );
}
