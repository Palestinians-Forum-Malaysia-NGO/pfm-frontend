import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useLayoutBase from "hooks/useLayoutBase";
import {
  MdArrowBack, MdEdit, MdDeleteOutline, MdEvent,
  MdLocationOn, MdCalendarToday, MdGroups, MdPerson,
  MdToggleOn, MdToggleOff, MdInfoOutline, MdUpdate,
} from "react-icons/md";
import Button from "components/ui/buttons/Button";
import PageHeader from "components/ui/PageHeader";
import FormHeader from "components/ui/form/FormHeader";
import InfoRow from "components/ui/InfoRow";
import AlertBanner from "components/ui/AlertBanner";
import Loading from "components/loading/Loading";
import DropdownButton from "components/ui/buttons/DropdownButton";
import StorageImage from "components/ui/StorageImage";
import EventDeleteModal from "./EventDeleteModal";
import EventRegistrationsSection from "components/features/eventRegistrations/components/EventRegistrationsSection";
import { useGetEvent, useDeleteEvent, useUpdateEvent } from "components/features/events/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) => d ? new Date(`${d}T00:00:00`).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric" }) : "—";
const fmtDateTime = (d) => d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
const fmtTime = (t) => {
  if (!t) return null;
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${m} ${suffix}`;
};

export default function EventDetailView() {
  const { t } = useTranslation();
  const { id }   = useParams();
  const navigate = useNavigate();
  const base = useLayoutBase();

  const { event, execute: fetchEvent, loading, error } = useGetEvent();
  const { execute: deleteEvent, loading: deleteLoading } = useDeleteEvent();
  const { execute: updateEvent, loading: toggling }      = useUpdateEvent();
  const { success, error: toastError } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  useEffect(() => { fetchEvent(id); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
      success(t("events.toast_deleted"), `"${event?.title}" ${t("events.toast_deleted_sub")}`);
      navigate(`${base}/events`);
    } catch (err) {
      toastError(t("events.toast_delete_failed"), err?.message);
    }
  };

  const handleToggleActive = async () => {
    try {
      await updateEvent(id, { is_active: !event.is_active });
      success(
        event.is_active ? t("events.toast_deactivated") : t("events.toast_activated"),
        `"${event.title}" ${event.is_active ? t("events.toast_deactivated_sub") : t("events.toast_activated_sub")}`
      );
      fetchEvent(id);
    } catch (err) {
      toastError(t("events.toast_toggle_failed"), err?.message);
    }
  };

  if (loading)  return <Loading text={t("events.loading")} />;
  if (error)    return <AlertBanner message={error} />;
  if (!event)   return null;

  return (
    <div className="mx-auto max-w-5xl flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6">

      <PageHeader
        icon={<MdEvent className="h-5 w-5" />}
        title={event.title}
        subtitle={t("events.detail_subtitle")}
        actions={
          <>
            <Button variant="ghost" icon={<MdArrowBack className="h-4 w-4" />} text={t("events.back")} onClick={() => navigate(`${base}/events`)} />
            <DropdownButton
              label={t("events.actions")}
              items={[
                { label: t("events.edit"), icon: <MdEdit className="h-4 w-4" />, onClick: () => navigate(`${base}/events/${id}/edit`) },
                {
                  label: event.is_active ? t("events.deactivate") : t("events.activate"),
                  icon: event.is_active ? <MdToggleOff className="h-4 w-4" /> : <MdToggleOn className="h-4 w-4" />,
                  onClick: handleToggleActive,
                },
                ...(isAdmin ? [
                  { divider: true },
                  { label: t("events.delete"), icon: <MdDeleteOutline className="h-4 w-4" />, onClick: () => setDeleteOpen(true), variant: "danger" },
                ] : []),
              ]}
            />
          </>
        }
      />

      {/* ── Hero card ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {event.cover_image ? (
          <StorageImage fileKey={event.cover_image} alt={event.title} className="h-48 w-full object-cover" />
        ) : (
          <div className="h-28 w-full bg-gradient-to-br from-green/10 via-green/5 to-green-50">
            <div className="h-full w-full bg-dot-green bg-[size:20px_20px] opacity-40" />
          </div>
        )}
        <div className="px-6 pb-6 pt-4 flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-slate-900">{event.title}</h2>
            {event.location && (
              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MdLocationOn className="h-4 w-4" /> {event.location}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${event.is_active ? "bg-green/10 text-green" : "bg-slate-100 text-slate-500"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${event.is_active ? "bg-green animate-pulse" : "bg-slate-400"}`} />
                {event.is_active ? t("events.active") : t("events.inactive")}
              </span>
              {event.is_full && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
                  <MdGroups className="h-3.5 w-3.5" /> {t("events.status_full")}
                </span>
              )}
            </div>
          </div>
          <Button
            variant={event.is_active ? "ghost" : "primary"}
            icon={event.is_active ? <MdToggleOff className="h-4 w-4" /> : <MdToggleOn className="h-4 w-4" />}
            text={event.is_active ? t("events.deactivate") : t("events.activate")}
            loading={toggling}
            onClick={handleToggleActive}
          />
        </div>
      </div>

      {/* ── Description ── */}
      {event.description && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <FormHeader icon={<MdEvent className="h-5 w-5" />} title={t("events.section_description")} subtitle={t("events.section_description_sub")} />
          <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">{event.description}</p>
        </div>
      )}

      {/* ── Event Info ── */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <FormHeader icon={<MdInfoOutline className="h-5 w-5" />} title={t("events.event_info")} subtitle={t("events.event_info_sub")} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("events.info_date")}     value={fmtDate(event.event_date)} />
          <InfoRow icon={<MdCalendarToday className="h-4 w-4" />} label={t("events.info_time")}     value={event.start_time ? `${fmtTime(event.start_time)}${event.end_time ? ` – ${fmtTime(event.end_time)}` : ""}` : "—"} />
          <InfoRow icon={<MdGroups className="h-4 w-4" />}        label={t("events.info_capacity")} value={event.capacity ?? "—"} />
          <InfoRow icon={<MdGroups className="h-4 w-4" />}        label={t("events.info_registered")} value={event.registered_count ?? 0} />
          <InfoRow icon={<MdPerson className="h-4 w-4" />}        label={t("events.created_by_info")} value={event.created_by || "—"} />
          <InfoRow icon={<MdUpdate className="h-4 w-4" />}        label={t("events.last_updated_info")} value={fmtDateTime(event.updated_at)} />
        </div>
      </div>

      {/* ── Registrations ── */}
      <EventRegistrationsSection eventId={id} />

      <EventDeleteModal
        open={deleteOpen}
        event={event}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  );
}
