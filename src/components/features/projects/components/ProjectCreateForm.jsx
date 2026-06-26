import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdAdd, MdAssignment, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateProject } from "components/features/projects/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { PROJECT_STATUS_OPTIONS } from "components/features/projects/constants/projects";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title: [
    { required: true,  message: "Title is required" },
    { maxLength: 255,  message: "Title must be 255 characters or fewer" },
  ],
};

export default function ProjectCreateForm() {
  const navigate = useNavigate();
  const { execute: createProject, loading, error } = useCreateProject();
  const { categories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm]     = useState({
    title: "", cover_image: null, category_id: "", status: "active", summary: "",
    description: "", beneficiary_info: "", target: "", start_date: "", end_date: "", is_published: false,
  });
  const [errors, setErrors] = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const CATEGORY_OPTIONS = [
    { value: "", label: "Select category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  const canSubmit = form.title.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.entries(RULES).forEach(([field, rules]) => {
      const err = validate(form[field], rules);
      if (err) newErrors[field] = err;
    });
    if (Object.keys(newErrors).length) { setErrors(newErrors); return; }

    try {
      const payload = {
        title:            form.title,
        cover_image:      form.cover_image      || undefined,
        category_id:      form.category_id      || undefined,
        status:           form.status           || undefined,
        summary:          form.summary          || undefined,
        description:      form.description      || undefined,
        beneficiary_info: form.beneficiary_info || undefined,
        target:           form.target           ? Number(form.target) : undefined,
        start_date:       form.start_date       || undefined,
        end_date:         form.end_date         || undefined,
        is_published:     form.is_published,
      };
      const created = await createProject(payload);
      success("Project created", `"${form.title}" has been added.`);
      navigate(`/admin/projects/${created.id}`);
    } catch (err) {
      toastError("Failed to create project", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title="New Project"
        subtitle="Create a new PFM community project"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Projects" onClick={() => navigate("/admin/projects")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title="Cover Image" subtitle="Shown on the public project page and listing" />
          <StorageCoverField
            folder="projects"
            onUpload={(key) => set("cover_image", key)}
            onRemove={() => set("cover_image", null)}
            errors={errors}
          />
        </div>

        {/* ── Overview ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title="Project Overview" subtitle="Title, category, and status" />
          <InputField label="Title" field="title" placeholder="e.g. Community Aid Programme 2026" formData={form} errors={errors} updateFormData={set} rules={RULES.title} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label="Category" field="category_id" options={CATEGORY_OPTIONS} formData={form} errors={errors} updateFormData={set} required={false} />
            <SelectField label="Status"   field="status"      options={PROJECT_STATUS_OPTIONS} formData={form} errors={errors} updateFormData={set} />
          </div>
          <TextareaField label="Summary" field="summary" rows={2} placeholder="A short one-paragraph summary visible in the project list…" formData={form} errors={errors} updateFormData={set} required={false} />
        </div>

        {/* ── Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title="Project Details" subtitle="Full description and beneficiary information" />
          <TextareaField label="Description"      field="description"      rows={5} placeholder="Full project description…" formData={form} errors={errors} updateFormData={set} required={false} />
          <TextareaField label="Beneficiary Info" field="beneficiary_info" rows={3} placeholder="Who will benefit from this project?" formData={form} errors={errors} updateFormData={set} required={false} />
        </div>

        {/* ── Funding & Dates ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title="Funding & Dates" subtitle="Funding target and project timeline" />
          <InputField label="Funding Target (MYR)" field="target" type="number" placeholder="e.g. 50000" formData={form} errors={errors} updateFormData={set} required={false} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label="Start Date" field="start_date" type="date" formData={form} errors={errors} updateFormData={set} required={false} />
            <InputField label="End Date"   field="end_date"   type="date" formData={form} errors={errors} updateFormData={set} required={false} />
          </div>
          <ToggleInput label="Publish immediately (make visible to public)" field="is_published" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/projects")} className="flex-1" />
          <Button type="submit" variant="primary" text="Create Project" icon={<MdAdd className="h-4 w-4" />} loading={loading} disabled={!canSubmit} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
