import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetApplications } from "./useGetApplications";
import { useDeleteApplication } from "./useDeleteApplication";
import { useToast } from "components/ui/toast/ToastContext";

export function useApplicationList(projectId) {
  const { t } = useTranslation();
  const { applications: fetched, loading, error, refetch } = useGetApplications();
  const { execute: deleteApplication, loading: deleteLoading } = useDeleteApplication();
  const { success, error: toastError } = useToast();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]         = useState(null);

  // The backend doesn't support filtering /applications by project server-side,
  // so when a projectId is given (e.g. the project detail page), narrow the
  // already-authorized full list down to that project client-side.
  const all = useMemo(
    () => (projectId ? fetched.filter((a) => a.project?.id === projectId) : fetched),
    [fetched, projectId]
  );

  const applications = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        (a.user?.full_name ?? "").toLowerCase().includes(q) ||
        (a.user?.email ?? "").toLowerCase().includes(q) ||
        (a.project?.title ?? "").toLowerCase().includes(q) ||
        (a.project?.title_ar ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    pending:  all.filter((a) => a.status === "pending").length,
    approved: all.filter((a) => a.status === "approved").length,
    rejected: all.filter((a) => a.status === "rejected").length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteApplication(toDelete.id);
      success(t("applications.toast_deleted"), t("applications.toast_deleted_sub"));
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("applications.toast_delete_failed"), err?.message);
    }
  };

  return {
    applications, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    refetch,
  };
}
