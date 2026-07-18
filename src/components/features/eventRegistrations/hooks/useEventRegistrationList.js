import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetEventRegistrations } from "./useGetEventRegistrations";
import { useUpdateEventRegistration } from "./useUpdateEventRegistration";
import { useDeleteEventRegistration } from "./useDeleteEventRegistration";
import { useToast } from "components/ui/toast/ToastContext";

export function useEventRegistrationList(eventId) {
  const { t } = useTranslation();
  const { registrations: all, loading, error, refetch } = useGetEventRegistrations(eventId);
  const { execute: updateRegistration } = useUpdateEventRegistration();
  const { execute: deleteRegistration, loading: deleteLoading } = useDeleteEventRegistration();
  const { success, error: toastError } = useToast();

  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]         = useState(null);

  const registrations = useMemo(() => {
    if (statusFilter === "all") return all;
    return all.filter((r) => r.status === statusFilter);
  }, [all, statusFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    pending:  all.filter((r) => r.status === "pending").length,
    approved: all.filter((r) => r.status === "approved").length,
    rejected: all.filter((r) => r.status === "rejected").length,
  }), [all]);

  const handleStatusChange = async (registration, status) => {
    try {
      await updateRegistration(eventId, registration.id, { status });
      success(t("eventRegistrations.toast_status_updated"), t("eventRegistrations.toast_status_updated_sub"));
      refetch();
    } catch (err) {
      toastError(t("eventRegistrations.toast_status_update_failed"), err?.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteRegistration(eventId, toDelete.id);
      success(t("eventRegistrations.toast_deleted"), t("eventRegistrations.toast_deleted_sub"));
      refetch();
    } catch (err) {
      toastError(t("eventRegistrations.toast_delete_failed"), err?.message);
    } finally {
      setToDelete(null);
    }
  };

  return {
    registrations, loading, error, stats,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleStatusChange,
    handleDeleteConfirm,
  };
}
