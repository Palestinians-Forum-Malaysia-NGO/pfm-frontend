import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdAssignment, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, SelectField, ToggleInput, StorageCoverField } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetProject, useUpdateProject } from "components/features/projects/hooks";
import { useGetCategories } from "components/features/categories/hooks";
import { PROJECT_STATUS_OPTIONS } from "components/features/projects/constants/projects";
import { useToast } from "components/ui/toast/ToastContext";

export default function ProjectEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { project, execute: fetchProject, loading, error: loadError } = useGetProject();
  const { execute: updateProject, loading: saving, error: saveError }  = useUpdateProject();
  const { categories } = useGetCategories();
  const { success, error: toastError } = useToast();

  const [form, setForm]       = useState({
    title: "", cover_image: null, category_id: "", status: "active", summary: "",
    description: "", beneficiary_info: "", target: "", start_date: "", end_date: "", is_published: false,
  });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});
  const [currentCoverUrl, setCurrentCoverUrl] = useState(null);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  const CATEGORY_OPTIONS = [
    { value: "", label: "Select category" },
    ...categories.map((c) => ({ value: c.id, label: c.name })),
  ];

  useEffect(() => {
    fetchProject(id).then((data) => {
      if (!data) return;
      const snap = {
        title:           data.title            ?? "",
        cover_image:     null,
        category_id:     data.category?.slug   ?? "",
        status:          data.status           ?? "active",
        summary:         data.summary          ?? "",
        description:     data.description      ?? "",
        beneficiary_info: data.beneficiary_info ?? "",
        target:          data.target != null   ? String(data.target) : "",
        start_date:      data.start_date       ? data.start_date.slice(0, 10) : "",
        end_date:        data.end_date         ? data.end_date.slice(0, 10)   : "",
        is_published:    data.is_published     ?? false,
      };
      setCurrentCoverUrl(data.cover_image ?? null);
      setForm(snap);
      setInitial(snap);
    }).catch(() => {});
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!form.title.trim()) { setErrors({ title: "Title is required" }); return; }

    try {
      const payload = {
        title:           form.title,
        category_id:     form.category_id     || undefined,
        status:          form.status          || undefined,
        summary:         form.summary         || undefined,
        description:     form.description     || undefined,
        beneficiary_info: form.beneficiary_info || undefined,
        target:          form.target          ? Number(form.target) : undefined,
        start_date:      form.start_date      || undefined,
        end_date:        form.end_date        || undefined,
        is_published:    form.is_published,
        // include cover_image only if user touched it (null = unset/removed, string = new key)
        ...(form.cover_image !== null ? { cover_image: form.cover_image || null } : {}),
      };
      await updateProject(id, payload);
      success("Project updated", `"${form.title}" has been saved.`);
      navigate(`${base}/projects/${id}`);
    } catch (err) {
      toastError("Failed to update project", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading project…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Project"
        subtitle={form.title || "Update project details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back" onClick={() => navigate(`${base}/projects/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title="Cover Image" subtitle="Shown on the public project page and listing" />
          <StorageCoverField
            folder="projects"
            currentUrl={currentCoverUrl}
            onUpload={(key) => { set("cover_image", key); setCurrentCoverUrl(null); }}
            onRemove={() => { set("cover_image", ""); setCurrentCoverUrl(null); }}
            errors={errors}
          />
        </div>

        {/* ── Overview ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdAssignment className="h-5 w-5" />} title="Project Overview" subtitle="Title, category, and status" />
          <InputField label="Title" field="title" placeholder="e.g. Community Aid Programme 2026" formData={form} errors={errors} updateFormData={set} rules={[{ required: true, message: "Title is required" }, { maxLength: 255, message: "Title must be 255 characters or fewer" }]} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <SelectField label="Category" field="category_id" options={CATEGORY_OPTIONS}    formData={form} errors={errors} updateFormData={set} required={false} />
            <SelectField label="Status"   field="status"      options={PROJECT_STATUS_OPTIONS} formData={form} errors={errors} updateFormData={set} />
          </div>
          {project?.slug && (
            <div className="mb-3 mt-1">
              <p className="mb-1 text-xs font-medium text-slate-400">Slug (auto-generated)</p>
              <p className="font-mono text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">{project.slug}</p>
            </div>
          )}
          <TextareaField label="Summary" field="summary" rows={2} placeholder="A short one-paragraph summary…" formData={form} errors={errors} updateFormData={set} required={false} />
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
          <ToggleInput label="Published (visible to public)" field="is_published" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`${base}/projects/${id}`)} className="flex-1" />
          <Button
            type="submit" variant="primary" text="Save Changes"
            loading={saving} disabled={!form.title.trim() || !isDirty}
            className="flex-1"
          />
        </div>

      </form>
    </div>
  );
}
