import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetEvents } from "./useGetEvents";
import { useDeleteEvent } from "./useDeleteEvent";
import { useUpdateEvent } from "./useUpdateEvent";
import { useToast } from "components/ui/toast/ToastContext";

export function useEventList() {
  const { t } = useTranslation();
  const { events, loading, error, refetch } = useGetEvents();
  const { execute: deleteEvent, loading: deleteLoading } = useDeleteEvent();
  const { execute: updateEvent, loading: toggleLoading } = useUpdateEvent();
  const { success, error: toastError } = useToast();

  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]     = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return events.filter((e) => {
      const matchSearch = !q
        || e.title?.toLowerCase().includes(q)
        || (e.location ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all"
        || (statusFilter === "active"   &&  e.is_active)
        || (statusFilter === "inactive" && !e.is_active)
        || (statusFilter === "full"     &&  e.is_full);
      return matchSearch && matchStatus;
    });
  }, [events, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    events.length,
    active:   events.filter((e) => e.is_active).length,
    inactive: events.filter((e) => !e.is_active).length,
    full:     events.filter((e) => e.is_full).length,
  }), [events]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteEvent(toDelete.id);
      success(t("events.toast_deleted"), `"${toDelete.title}" ${t("events.toast_deleted_sub")}`);
      refetch();
    } catch {
      toastError(t("events.toast_delete_failed"));
    } finally {
      setToDelete(null);
    }
  };

  const handleToggleActive = async (event) => {
    try {
      await updateEvent(event.id, { is_active: !event.is_active });
      success(
        event.is_active ? t("events.toast_deactivated") : t("events.toast_activated"),
        `"${event.title}" ${event.is_active ? t("events.toast_deactivated_sub") : t("events.toast_activated_sub")}`
      );
      refetch();
    } catch {
      toastError(t("events.toast_toggle_failed"));
    }
  };

  return {
    events: filtered,
    loading,
    error,
    refetch,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    toDelete,     setToDelete,
    deleteLoading,
    toggleLoading,
    handleDeleteConfirm,
    handleToggleActive,
  };
}
