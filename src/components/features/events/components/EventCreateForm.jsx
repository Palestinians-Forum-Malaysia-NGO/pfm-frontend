import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdAdd, MdEvent, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import { useCreateEvent } from "components/features/events/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title:      [{ required: true }, { maxLength: 255 }],
  event_date: [{ required: true }],
};

export default function EventCreateForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const base = useLayoutBase();
  const { execute: createEvent, loading, error } = useCreateEvent();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    title: "", description: "",
    cover_image: null,
    location: "",
    event_date: "", start_time: "", end_time: "",
    capacity: "",
    is_active: true,
  });
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
    setErrors({});

    try {
      const created = await createEvent({
        title:       form.title,
        description: form.description || undefined,
        cover_image: form.cover_image  || undefined,
        location:    form.location    || undefined,
        event_date:  form.event_date,
        start_time:  form.start_time  || undefined,
        end_time:    form.end_time    || undefined,
        capacity:    form.capacity ? Number(form.capacity) : undefined,
        is_active:   form.is_active,
      });
      success(t("events.toast_created"), `"${form.title}" ${t("events.toast_created_sub")}`);
      navigate(`${base}/events/${created.id}`);
    } catch (err) {
      toastError(t("events.toast_create_failed"), err?.message);
    }
  };

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdAdd className="h-5 w-5" />}
        title={t("events.add_title")}
        subtitle={t("events.add_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("events.back")} onClick={() => navigate(`${base}/events`)} />
        }
      />

      <AlertBanner message={error} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("events.cover_section")} subtitle={t("events.cover_subtitle")} />
          <StorageCoverField
            folder="events"
            onUpload={(key) => set("cover_image", key)}
            onRemove={() => set("cover_image", null)}
            errors={errors}
          />
        </div>

        {/* ── Details ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdEvent className="h-5 w-5" />} title={t("events.details_section")} subtitle={t("events.details_subtitle")} />

          <InputField label={t("events.title_label")} field="title" placeholder="e.g. Annual Fundraising Gala"
            formData={form} errors={errors} updateFormData={set} rules={RULES.title} />

          <InputField label={t("events.location_label")} field="location" placeholder="e.g. Kuala Lumpur Convention Centre"
            required={false} formData={form} errors={errors} updateFormData={set} />

          <TextareaField label={t("events.description_label")} field="description" rows={5}
            placeholder={t("events.description_placeholder")}
            required={false} formData={form} errors={errors} updateFormData={set} />
        </div>

        {/* ── Schedule & Capacity ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdEvent className="h-5 w-5" />} title={t("events.schedule_section")} subtitle={t("events.schedule_subtitle")} />
          <InputField label={t("events.event_date_label")} field="event_date" type="date"
            formData={form} errors={errors} updateFormData={set} rules={RULES.event_date} />
          <div className="grid grid-cols-1 gap-x-5 sm:grid-cols-2">
            <InputField label={t("events.start_time_label")} field="start_time" type="time"
              required={false} formData={form} errors={errors} updateFormData={set} />
            <InputField label={t("events.end_time_label")} field="end_time" type="time"
              required={false} formData={form} errors={errors} updateFormData={set} />
          </div>
          <InputField label={t("events.capacity_label")} field="capacity" type="number" placeholder="e.g. 100"
            required={false} formData={form} errors={errors} updateFormData={set} />
          <ToggleInput label={t("events.active_toggle")} field="is_active" formData={form} errors={errors} updateFormData={set} />
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" text={t("events.cancel")} onClick={() => navigate(`${base}/events`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("events.create_btn")} icon={<MdAdd className="h-4 w-4" />}
            loading={loading} disabled={!form.title.trim() || !form.event_date || loading} className="flex-1" />
        </div>

      </form>
    </div>
  );
}
