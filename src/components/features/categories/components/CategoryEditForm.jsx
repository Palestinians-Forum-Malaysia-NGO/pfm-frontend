import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdCategory } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, SelectField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetCategory, useUpdateCategory, useGetCategories } from "components/features/categories/hooks";
import { MODULE_OPTIONS } from "components/features/categories/constants/category";
import { useToast } from "components/ui/toast/ToastContext";

export default function CategoryEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { category, execute: fetchCategory, loading, error: loadError } = useGetCategory();
  const { execute: updateCategory, loading: saving, error: saveError }  = useUpdateCategory();
  const { categories: allCategories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm]       = useState({ name: "", module: "", description: "", parent: "", order: "", is_active: true });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  const parentOptions = allCategories
    .filter((c) => c.id !== id)
    .map((c) => ({ value: c.id, label: c.name }));

  useEffect(() => {
    fetchCategory(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:        data.name        ?? "",
        module:      data.module      ?? "",
        description: data.description ?? "",
        parent:      data.parent      ?? "",
        order:       data.order != null ? String(data.order) : "",
        is_active:   data.is_active   ?? true,
      };
      setForm(snapshot);
      setInitial(snapshot);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.name.trim()) { setErrors({ name: "Name is required" }); return; }

    try {
      await updateCategory(id, {
        name:        form.name,
        module:      form.module      || undefined,
        description: form.description || undefined,
        parent:      form.parent      || undefined,
        order:       form.order !== "" ? Number(form.order) : undefined,
        is_active:   form.is_active,
      });
      success("Category updated", `"${form.name}" has been updated.`);
      navigate(`${base}/categories/${id}`);
    } catch (err) {
      toastError("Failed to update category", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading category…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Category"
        subtitle={form.name || "Update category details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back" onClick={() => navigate(`${base}/categories/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCategory className="h-5 w-5" />} title="Category Details" subtitle="Update name, module, description, and status" />

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Name"
              field="name"
              placeholder="e.g. General Member"
              formData={form} errors={errors} updateFormData={set}
              rules={[
                { required: true,  message: "Name is required" },
                { maxLength: 255,  message: "Name must be 255 characters or fewer" },
              ]}
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

          {category?.slug && (
            <div className="mb-3">
              <p className="mb-1 text-xs font-medium text-slate-400">Slug (auto-generated)</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{category.slug}</p>
            </div>
          )}

          <ToggleInput label="Active" field="is_active" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`${base}/categories/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text="Save Changes" loading={saving} disabled={!form.name.trim() || !isDirty} className="flex-1" />
        </div>
      </form>
    </div>
  );
}
