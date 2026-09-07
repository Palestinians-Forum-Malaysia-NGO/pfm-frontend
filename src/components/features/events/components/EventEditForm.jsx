import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import { MdArrowBack, MdEdit, MdEvent, MdImage } from "react-icons/md";
import PageHeader from "components/ui/PageHeader";
import { InputField, TextareaField, ToggleInput, StorageCoverField, validate } from "components/form";
import Button from "components/ui/buttons/Button";
import FormHeader from "components/ui/form/FormHeader";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import { useGetEvent, useUpdateEvent } from "components/features/events/hooks";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import { useToast } from "components/ui/toast/ToastContext";

const RULES = {
  title:      [{ required: true }, { maxLength: 255 }],
  event_date: [{ required: true }],
};

export default function EventEditForm() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { execute: fetchEvent, loading, error: loadError } = useGetEvent();
  const { execute: updateEvent, loading: saving, error: saveError } = useUpdateEvent();
  const { success, error: toastError } = useToast();

  const [form, setForm] = useState({
    title: "", description: "",
    cover_image: null,
    location: "",
    event_date: "", start_time: "", end_time: "",
    capacity: "",
    is_active: true,
  });
  const [initial, setInitial]   = useState(null);
  const [errors, setErrors]     = useState({});
  const [coverKey, setCoverKey] = useState(null);
  const { url: currentCoverUrl } = useStorageUrl(coverKey);

  const set = (f, v) => setForm((p) => ({ ...p, [f]: v }));

  const isDirty = !initial || JSON.stringify(form) !== JSON.stringify(initial);

  useEffect(() => {
    fetchEvent(id).then((data) => {
      if (!data) return;
      const snap = {
        title:       data.title       ?? "",
        description: data.description ?? "",
        cover_image: null,
        location:    data.location    ?? "",
        event_date:  data.event_date  ?? "",
        start_time:  data.start_time  ? data.start_time.slice(0, 5) : "",
        end_time:    data.end_time    ? data.end_time.slice(0, 5)   : "",
        capacity:    data.capacity != null ? String(data.capacity) : "",
        is_active:   data.is_active   ?? true,
      };
      setCoverKey(data.cover_image ?? null);
      setForm(snap);
      setInitial(snap);
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
      const payload = {
        title:       form.title,
        description: form.description || undefined,
        location:    form.location    || undefined,
        event_date:  form.event_date,
        start_time:  form.start_time  || undefined,
        end_time:    form.end_time    || undefined,
        capacity:    form.capacity ? Number(form.capacity) : undefined,
        is_active:   form.is_active,
        ...(form.cover_image !== null ? { cover_image: form.cover_image || null } : {}),
      };
      await updateEvent(id, payload);
      success(t("events.toast_updated"), `"${form.title}" ${t("events.toast_updated_sub")}`);
      navigate(`${base}/events/${id}`);
    } catch (err) {
      toastError(t("events.toast_update_failed"), err?.message);
    }
  };

  if (loading)   return <Loading text={t("events.loading")} />;
  if (loadError) return <p className="py-12 text-center text-sm text-red-500">{loadError}</p>;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEdit className="h-5 w-5" />}
        title={t("events.edit_title")}
        subtitle={form.title || t("events.detail_subtitle")}
        actions={
          <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("events.back_to_event")} onClick={() => navigate(`${base}/events/${id}`)} />
        }
      />

      <AlertBanner message={saveError} />

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* ── Cover Image ── */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdImage className="h-5 w-5" />} title={t("events.cover_section")} subtitle={t("events.cover_subtitle")} />
          <StorageCoverField
            folder="events"
            currentUrl={currentCoverUrl}
            onUpload={(key) => { set("cover_image", key); setCoverKey(null); }}
            onRemove={() => { set("cover_image", ""); setCoverKey(null); }}
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
          <Button variant="ghost" text={t("events.cancel")} onClick={() => navigate(`${base}/events/${id}`)} className="flex-1" />
          <Button type="submit" variant="primary" text={t("events.save_changes")}
            loading={saving} disabled={!isDirty || saving} className="flex-1" />
        </div>
      </form>
    </div>
  );
}
