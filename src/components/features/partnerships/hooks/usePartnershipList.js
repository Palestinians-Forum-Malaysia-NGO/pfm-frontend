import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetPartnerships } from "./useGetPartnerships";
import { useDeletePartnership } from "./useDeletePartnership";
import { useRestorePartnership } from "./useRestorePartnership";
import { useToast } from "components/ui/toast/ToastContext";

export function usePartnershipList() {
  const { t } = useTranslation();
  const { partnerships: all, loading, error, refetch } = useGetPartnerships();
  const { execute: deletePartnership, loading: deleteLoading } = useDeletePartnership();
  const { execute: restorePartnership, loading: restoreLoading } = useRestorePartnership();
  const { success, error: toastError } = useToast();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter]     = useState("all");
  const [toDelete, setToDelete]         = useState(null);

  const partnerships = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((p) => (statusFilter === "active" ? p.is_active : !p.is_active));
    if (typeFilter !== "all") list = list.filter((p) => p.partnership_type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [all, search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    active:   all.filter((p) => p.is_active).length,
    inactive: all.filter((p) => !p.is_active).length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deletePartnership(toDelete.id);
      success(t("partnerships.toast_deleted"), `"${toDelete.name}" ${t("partnerships.toast_deleted_sub")}`);
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("partnerships.toast_delete_failed"), err?.message);
    }
  };

  const handleRestore = async (partnership) => {
    try {
      await restorePartnership(partnership.id);
      success(t("partnerships.toast_restored"), `"${partnership.name}" ${t("partnerships.toast_restored_sub")}`);
      refetch();
    } catch (err) {
      toastError(t("partnerships.toast_restore_failed"), err?.message);
    }
  };

  return {
    partnerships, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    typeFilter, setTypeFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    restoreLoading,
    handleRestore,
  };
}
