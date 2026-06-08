import { useState, useMemo } from "react";
import useGetStaffs from "./useGetStaffs";
import useDeleteStaff from "./useDeleteStaff";
import { useToast } from "components/ui/toast/ToastContext";

const useStaffList = () => {
  const { staffs, loading, error, refetch } = useGetStaffs();
  const { execute: deleteStaff, loading: deleteLoading } = useDeleteStaff();
  const toast = useToast();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete,     setToDelete]     = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staffs.filter((s) => {
      const matchesSearch =
        !q ||
        s.user?.full_name?.toLowerCase().includes(q) ||
        s.user?.email?.toLowerCase().includes(q) ||
        s.employee_id?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.position?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  s.user?.is_active) ||
        (statusFilter === "inactive" && !s.user?.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [staffs, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    staffs.length,
    active:   staffs.filter((s) => s.user?.is_active).length,
    inactive: staffs.filter((s) => !s.user?.is_active).length,
  }), [staffs]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteStaff(toDelete.id);
      toast.success(`${toDelete.user?.full_name || "Staff member"} has been removed.`);
      refetch();
    } catch {
      toast.error("Failed to remove staff member.");
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
    search,        setSearch,
    statusFilter,  setStatusFilter,
    toDelete,      setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
};

export default useStaffList;
