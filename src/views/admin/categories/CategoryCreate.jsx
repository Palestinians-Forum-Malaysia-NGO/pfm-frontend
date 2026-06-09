import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdAdd, MdCategory } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, ToggleInput, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateCategory } from "components/features/categories/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [{ required: true, message: "Name is required" }],
};

export default function CategoryCreate() {
  const navigate = useNavigate();
  const { execute: createCategory, loading, error } = useCreateCategory();
  const { success, error: toastError } = useToast();

  const [form, setForm]     = useState({ name: "", description: "", is_active: true });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

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
        description: form.description || undefined,
        is_active:   form.is_active,
      });
      success("Category created", `"${form.name}" has been added.`);
      navigate(`/admin/categories/${created.id}`);
    } catch (err) {
      toastError("Failed to create category", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title="Add Category"
        subtitle="Create a new PFM membership category"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Categories" onClick={() => navigate("/admin/categories")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdCategory className="h-5 w-5" />} title="Category Details" subtitle="Name, description, and initial status" />
          <InputField
            label="Name"
            field="name"
            placeholder="e.g. General Member"
            formData={form}
            errors={errors}
            updateFormData={set}
            rules={RULES.name}
          />
          <InputField
            label="Description"
            field="description"
            placeholder="Brief description of this category…"
            formData={form}
            errors={errors}
            updateFormData={set}
          />
          <ToggleInput label="Active" field="is_active" formData={form} errors={errors} updateFormData={set} />
          <p className="mt-2 text-xs text-slate-400">The slug will be auto-generated from the name.</p>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/categories")} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Category"
            icon={<MdAdd className="h-4 w-4" />}
            loading={loading}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
