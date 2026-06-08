import { useState, useMemo } from "react";
import useGetMembers from "./useGetMembers";
import useDeleteMember from "./useDeleteMember";
import { useToast } from "components/ui/toast/ToastContext";

const useMemberList = () => {
  const { members, loading, error, refetch } = useGetMembers();
  const { execute: deleteMember, loading: deleteLoading } = useDeleteMember();
  const { success, error: toastError } = useToast();

  const [search,           setSearch]           = useState("");
  const [statusFilter,     setStatusFilter]     = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [toDelete,         setToDelete]         = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return members.filter((m) => {
      const matchesSearch =
        !q ||
        m.user?.full_name?.toLowerCase().includes(q) ||
        m.user?.email?.toLowerCase().includes(q) ||
        m.passport_number?.toLowerCase().includes(q) ||
        m.classification?.name?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  m.user?.is_active) ||
        (statusFilter === "inactive" && !m.user?.is_active);

      const matchesMembership =
        membershipFilter === "all" || m.membership_status === membershipFilter;

      return matchesSearch && matchesStatus && matchesMembership;
    });
  }, [members, search, statusFilter, membershipFilter]);

  const stats = useMemo(() => ({
    total:     members.length,
    active:    members.filter((m) => m.user?.is_active).length,
    inactive:  members.filter((m) => !m.user?.is_active).length,
    pending:   members.filter((m) => m.membership_status === "pending").length,
  }), [members]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteMember(toDelete.id);
      success("Member removed", `${toDelete.user?.full_name || "Member"} has been removed.`);
      refetch();
    } catch {
      toastError("Failed to remove member.");
    } finally {
      setToDelete(null);
    }
  };

  return {
    members: filtered,
    loading,
    error,
    refetch,
    stats,
    search,           setSearch,
    statusFilter,     setStatusFilter,
    membershipFilter, setMembershipFilter,
    toDelete,         setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
};

export default useMemberList;
