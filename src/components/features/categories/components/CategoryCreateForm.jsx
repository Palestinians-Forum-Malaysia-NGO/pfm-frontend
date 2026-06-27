import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdCategory } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateCategory, useGetCategories } from "components/features/categories/hooks";
import { MODULE_OPTIONS } from "components/features/categories/constants/category";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [
    { required: true, message: "Name is required" },
    { maxLength: 255, message: "Name must be 255 characters or fewer" },
  ],
};

export default function CategoryCreateForm() {
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createCategory, loading, error } = useCreateCategory();
  const { categories: allCategories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm]     = useState({ name: "", module: "", description: "", parent: "", order: "", hex_color: "", text_color: "", is_active: true });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const parentOptions = allCategories.map((c) => ({ value: c.id, label: c.name }));

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
        name:        form.name,
        module:      form.module      || undefined,
        description: form.description || undefined,
        parent:      form.parent      || undefined,
        order:       form.order !== "" ? Number(form.order) : undefined,
        hex_color:   form.hex_color   || undefined,
        text_color:  form.text_color  || undefined,
        is_active:   form.is_active,
      });
      success("Category created", `"${form.name}" has been added.`);
      navigate(`${base}/categories/${created.id}`);
    } catch (err) {
      toastError("Failed to create category", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title="Add Category"
        subtitle="Create a new PFM category"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Categories" onClick={() => navigate(`${base}/categories`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCategory className="h-5 w-5" />} title="Category Details" subtitle="Name, module, description, and status" />

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Name"
              field="name"
              placeholder="e.g. General Member"
              formData={form} errors={errors} updateFormData={set} rules={RULES.name}
            />
            <SelectField
              label="Module"
              field="module"
              options={MODULE_OPTIONS}
              placeholder="Select module…"
              formData={form} errors={errors} updateFormData={set}
            />
          </div>

          <InputField
            label="Description"
            field="description"
            placeholder="Brief description of this category…"
            formData={form} errors={errors} updateFormData={set}
          />

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField
              label="Parent Category"
              field="parent"
              options={parentOptions}
              placeholder="None (top-level)"
              formData={form} errors={errors} updateFormData={set}
            />
            <InputField
              label="Order"
              field="order"
              type="number"
              placeholder="0"
              formData={form} errors={errors} updateFormData={set}
            />
          </div>

          {/* Colors */}
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <div className="mb-4">
              <label className="mb-1.5 block text-sm font-medium text-slate-900">Background Color</label>
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
              <label className="mb-1.5 block text-sm font-medium text-slate-900">Text Color</label>
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

          <ToggleInput label="Active" field="is_active" formData={form} errors={errors} updateFormData={set} />
          <p className="mt-2 text-xs text-slate-400">The slug will be auto-generated from the name.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`${base}/categories`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Category"
            icon={<MdAdd className="h-4 w-4" />}
            loading={loading}
            disabled={!form.name.trim()}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
