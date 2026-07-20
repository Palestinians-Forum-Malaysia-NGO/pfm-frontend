import React from "react";
import { useTranslation } from "react-i18next";
import { MdGroups, MdSchedule, MdCheckCircle, MdCancel, MdDeleteOutline } from "react-icons/md";
import { useEventRegistrationList } from "components/features/eventRegistrations/hooks";
import EventRegistrationDeleteModal from "./EventRegistrationDeleteModal";
import FormHeader from "components/ui/form/FormHeader";
import FilterSelect from "components/ui/FilterSelect";
import RowIconButton from "components/ui/buttons/RowIconButton";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function EventRegistrationsSection({ eventId }) {
  const { t } = useTranslation();
  const {
    registrations, loading, error, stats,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleStatusChange,
    handleDeleteConfirm,
  } = useEventRegistrationList(eventId);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const STATUS_OPTIONS = [
    { value: "pending",  label: t("eventRegistrations.status_pending") },
    { value: "approved", label: t("eventRegistrations.status_approved") },
    { value: "rejected", label: t("eventRegistrations.status_rejected") },
  ];

  const FILTER_OPTIONS = [
    { value: "all", label: t("eventRegistrations.status_all") },
    ...STATUS_OPTIONS,
  ];

  const statCards = [
    { key: "total",    label: t("eventRegistrations.total"),           value: stats.total,    icon: <MdGroups className="h-4 w-4" />,     color: "text-slate-600", bgColor: "bg-slate-100" },
    { key: "pending",  label: t("eventRegistrations.status_pending"),  value: stats.pending,  icon: <MdSchedule className="h-4 w-4" />,    color: "text-amber-600", bgColor: "bg-amber-50" },
    { key: "approved", label: t("eventRegistrations.status_approved"), value: stats.approved, icon: <MdCheckCircle className="h-4 w-4" />, color: "text-green",     bgColor: "bg-green/10" },
    { key: "rejected", label: t("eventRegistrations.status_rejected"), value: stats.rejected, icon: <MdCancel className="h-4 w-4" />,      color: "text-red-500",   bgColor: "bg-red-50" },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <FormHeader icon={<MdGroups className="h-5 w-5" />} title={t("eventRegistrations.section_title")} subtitle={t("eventRegistrations.section_subtitle")} />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3.5">
            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}>{card.icon}</div>
            <div className="min-w-0 flex-1">
              <p className="text-xl font-bold leading-none text-slate-900">{loading ? "—" : card.value}</p>
              <p className="mt-0.5 truncate text-xs text-slate-400">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-end">
        <FilterSelect value={statusFilter} onChange={setStatusFilter} options={FILTER_OPTIONS} icon={<MdSchedule className="h-3.5 w-3.5" />} />
      </div>

      {error && <p className="py-4 text-center text-sm text-red-500">{error}</p>}

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}
        </div>
      ) : registrations.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-400">{t("eventRegistrations.none_yet")}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead>
              <tr className="border-b border-slate-100">
                {[
                  t("eventRegistrations.col_name"),
                  t("eventRegistrations.col_phone"),
                  t("eventRegistrations.col_status"),
                  t("eventRegistrations.col_registered"),
                  t("eventRegistrations.col_actions"),
                ].map((col) => (
                  <th key={col} className="pb-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {registrations.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-semibold text-slate-900">{r.full_name}</p>
                    <p className="text-xs text-slate-400">{r.email}</p>
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-600">{r.phone || "—"}</td>
                  <td className="py-3 pr-4">
                    <FilterSelect
                      value={r.status}
                      onChange={(v) => handleStatusChange(r, v)}
                      options={STATUS_OPTIONS}
                      className="min-w-[130px]"
                    />
                  </td>
                  <td className="py-3 pr-4 text-sm text-slate-500">{fmtDate(r.registered_at)}</td>
                  <td className="py-3">
                    {isAdmin && (
                      <RowIconButton icon={<MdDeleteOutline className="h-4 w-4" />} title={t("eventRegistrations.delete")} onClick={() => setToDelete(r)} variant="danger" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <EventRegistrationDeleteModal
        open={!!toDelete}
        registration={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
      />
    </div>
  );
}
