import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdArrowBack, MdEdit, MdGroups } from "react-icons/md";
import PageHeader   from "components/ui/PageHeader";
import { InputField, TextareaField, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import Loading      from "components/loading/Loading";
import { useGetClassification, useUpdateClassification } from "components/features/classifications/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [
    { required: true, message: "Name is required" },
    { maxLength: 255, message: "Name must be 255 characters or fewer" },
  ],
};

export default function ClassificationEditForm() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const { execute: fetchClassification, loading, error: loadError } = useGetClassification();
  const { execute: updateClassification, loading: saving, error: saveError } = useUpdateClassification();
  const { success, error: toastError } = useToast();

  const [form, setForm]       = useState({ name: "", name_ar: "", description: "", description_ar: "" });
  const [initial, setInitial] = useState(null);
  const [errors, setErrors]   = useState({});

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || (
    form.name           !== initial.name           ||
    form.name_ar        !== initial.name_ar        ||
    form.description    !== initial.description    ||
    form.description_ar !== initial.description_ar
  );

  useEffect(() => {
    fetchClassification(id).then((data) => {
      if (!data) return;
      const snapshot = {
        name:            data.name            ?? "",
        name_ar:         data.name_ar         ?? "",
        description:     data.description     ?? "",
        description_ar:  data.description_ar  ?? "",
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
      await updateClassification(id, {
        name:            form.name,
        name_ar:         form.name_ar         || undefined,
        description:     form.description     || undefined,
        description_ar:  form.description_ar  || undefined,
      });
      success("Classification updated", `"${form.name}" has been updated successfully.`);
      navigate(`/admin/classifications/${id}`);
    } catch (err) {
      toastError("Failed to update classification", err?.message);
    }
  };

  if (loading)   return <Loading text="Loading classification…" />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title="Edit Classification"
        subtitle={form.name || "Update classification details"}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back" onClick={() => navigate(`/admin/classifications/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdGroups className="h-5 w-5" />} title="Classification Details" subtitle="Update name and description" />

          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField
              label="Name (English)"
              field="name"
              placeholder="e.g. Refugee, Displaced, Asylum Seeker"
              formData={form} errors={errors} updateFormData={set} rules={RULES.name}
            />
            <InputField
              label="Name (Arabic)"
              field="name_ar"
              placeholder="مثال: لاجئ، نازح، طالب لجوء"
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <TextareaField
              label="Description (English)"
              field="description"
              rows={3}
              placeholder="Brief description of this classification…"
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
            <TextareaField
              label="Description (Arabic)"
              field="description_ar"
              rows={3}
              placeholder="وصف مختصر لهذا التصنيف…"
              required={false}
              formData={form} errors={errors} updateFormData={set}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate(`/admin/classifications/${id}`)} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Save Changes"
            loading={saving}
            disabled={!form.name.trim() || !isDirty || saving}
            className="flex-1"
          />
        </div>
      </form>
    </div>
  );
}
