import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdAdd, MdGroups } from "react-icons/md";
import PageHeader   from "components/ui/PageHeader";
import { InputField, TextareaField, validate } from "components/form";
import Button       from "components/ui/buttons/Button";
import FormHeader   from "components/ui/form/FormHeader";
import AlertBanner  from "components/ui/AlertBanner";
import { useCreateClassification } from "components/features/classifications/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  name: [
    { required: true, message: "Name is required" },
    { maxLength: 255, message: "Name must be 255 characters or fewer" },
  ],
};

export default function ClassificationCreateForm() {
  const navigate = useNavigate();
  const { execute: createClassification, loading, error } = useCreateClassification();
  const { success, error: toastError } = useToast();

  const [form, setForm]     = useState({ name: "", description: "" });
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
      const created = await createClassification({
        name:        form.name,
        description: form.description || undefined,
      });
      success("Classification created", `"${form.name}" has been added.`);
      navigate(`/admin/classifications/${created.id}`);
    } catch (err) {
      toastError("Failed to create classification", err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title="Add Classification"
        subtitle="Create a new beneficiary classification"
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text="Back to Classifications" onClick={() => navigate("/admin/classifications")} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdGroups className="h-5 w-5" />} title="Classification Details" subtitle="Name and description for this classification" />

          <InputField
            label="Name"
            field="name"
            placeholder="e.g. Refugee, Displaced, Asylum Seeker"
            formData={form} errors={errors} updateFormData={set} rules={RULES.name}
          />
          <TextareaField
            label="Description"
            field="description"
            rows={3}
            placeholder="Brief description of this classification…"
            required={false}
            formData={form} errors={errors} updateFormData={set}
          />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={() => navigate("/admin/classifications")} className="flex-1" />
          <Button
            type="submit"
            variant="primary"
            text="Add Classification"
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
