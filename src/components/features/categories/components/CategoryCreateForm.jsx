import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdCategory } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, TextareaField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateCategory, useGetCategories } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [{ required: true }, { maxLength: 255 }],
};

export default function CategoryCreateForm() {
  const { t, i18n } = useTranslation();
  const MODULE_OPTIONS = [
    { value: "beneficiaries", label: t("categories.module_beneficiaries") },
    { value: "projects",      label: t("categories.module_projects") },
    { value: "blogs",         label: t("categories.module_blogs") },
    { value: "donations",     label: t("categories.module_donations") },
    { value: "campaigns",     label: t("categories.module_campaigns") },
  ];
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createCategory, loading, error } = useCreateCategory();
  const { categories: allCategories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    name: "", name_ar: "", module: "",
    description: "", description_ar: "",
    parent: "", order: "", hex_color: "", text_color: "", is_active: true,
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const parentOptions = allCategories.map((c) => ({
    value: c.id,
    label: (c.name_ar && i18n.language === "ar") ? c.name_ar : c.name,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const created = await createCategory({
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
      success(t("categories.toast_created"), `"${form.name}" ${t("categories.toast_created_sub")}`);
      navigate(`${base}/categories/${created.id}`);
    } catch (err) {
      toastError(t("categories.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("categories.add_title")}
        subtitle={t("categories.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("categories.back")} onClick={() => navigate(`${base}/categories`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCategory className="h-5 w-5" />} title={t("categories.section_title")} subtitle={t("categories.section_subtitle_create")} />

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

          <ToggleInput label={t("categories.active")} field="is_active" formData={form} errors={errors} updateFormData={set} />
          <p className="mt-2 text-xs text-slate-400">{t("categories.slug_hint")}</p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("categories.cancel")} onClick={() => navigate(`${base}/categories`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text={t("categories.create_btn")}
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
