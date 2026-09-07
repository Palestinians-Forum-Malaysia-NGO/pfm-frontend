import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useGetStaffs from "./useGetStaffs";
import useDeleteStaff from "./useDeleteStaff";
import { useToast } from "components/ui/toast/ToastContext";

const useStaffList = () => {
  const { t } = useTranslation();
  const { staffs, loading, error, refetch } = useGetStaffs();
  const { execute: deleteStaff, loading: deleteLoading } = useDeleteStaff();
  const { success, error: toastError } = useToast();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete,     setToDelete]     = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staffs.filter((s) => {
      const matchesSearch =
        !q ||
        (s.user?.full_name    ?? "").toLowerCase().includes(q) ||
        (s.user?.full_name_ar ?? "").toLowerCase().includes(q) ||
        (s.user?.email        ?? "").toLowerCase().includes(q) ||
        (s.employee_id        ?? "").toLowerCase().includes(q) ||
        (s.department         ?? "").toLowerCase().includes(q) ||
        (s.department_ar      ?? "").toLowerCase().includes(q) ||
        (s.position           ?? "").toLowerCase().includes(q) ||
        (s.position_ar        ?? "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  s.user?.is_active) ||
        (statusFilter === "inactive" && !s.user?.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [staffs, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    staffs.length,
    active:   staffs.filter((s) =>  s.user?.is_active).length,
    inactive: staffs.filter((s) => !s.user?.is_active).length,
  }), [staffs]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteStaff(toDelete.id);
      success(
        t("staff.toast_removed"),
        `${toDelete.user?.full_name || ""} ${t("staff.toast_removed_sub")}`,
      );
      refetch();
    } catch {
      toastError(t("staff.toast_remove_failed"));
    } finally {
      setToDelete(null);
    }
  };

  return {
    staffs: filtered,
    loading,
    error,
    refetch,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    toDelete,     setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
};

export default useStaffList;
