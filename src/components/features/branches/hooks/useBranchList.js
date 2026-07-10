import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetBranches } from "./useGetBranches";
import { useDeleteBranch } from "./useDeleteBranch";
import { useToast } from "components/ui/toast/ToastContext";

export function useBranchList() {
  const { t } = useTranslation();
  const { branches: all, loading, error, refetch } = useGetBranches();
  const { execute: deleteBranch, loading: deleteLoading } = useDeleteBranch();
  const { success, error: toastError } = useToast();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]         = useState(null);

  const branches = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((b) => (statusFilter === "active" ? b.is_active : !b.is_active));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        (b.name_ar ?? "").toLowerCase().includes(q) ||
        (b.branch_uid ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    active:   all.filter((b) => b.is_active).length,
    inactive: all.filter((b) => !b.is_active).length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteBranch(toDelete.id);
      success(t("branches.toast_deleted"), `"${toDelete.name}" ${t("branches.toast_deleted_sub")}`);
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("branches.toast_delete_failed"), err?.message);
    }
  };

  return {
    branches, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
}
