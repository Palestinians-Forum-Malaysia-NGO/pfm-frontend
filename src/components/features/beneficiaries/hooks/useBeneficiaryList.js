import { useState, useMemo } from "react";
import useGetBeneficiaries from "./useGetBeneficiaries";
import useDeleteBeneficiary from "./useDeleteBeneficiary";
import { useToast } from "components/ui/toast/ToastContext";

const useBeneficiaryList = () => {
  const { beneficiaries, loading, error, refetch } = useGetBeneficiaries();
  const { execute: deleteBeneficiary, loading: deleteLoading } = useDeleteBeneficiary();
  const { success, error: toastError } = useToast();

  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");
  const [toDelete,      setToDelete]      = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return beneficiaries.filter((b) => {
      const matchesSearch =
        !q ||
        b.user?.full_name?.toLowerCase().includes(q) ||
        b.user?.email?.toLowerCase().includes(q) ||
        b.passport_number?.toLowerCase().includes(q) ||
        b.classification?.name?.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  b.user?.is_active) ||
        (statusFilter === "inactive" && !b.user?.is_active);

      const matchesAccount =
        accountFilter === "all" || b.account_status === accountFilter;

      return matchesSearch && matchesStatus && matchesAccount;
    });
  }, [beneficiaries, search, statusFilter, accountFilter]);

  const stats = useMemo(() => ({
    total:    beneficiaries.length,
    active:   beneficiaries.filter((b) => b.user?.is_active).length,
    inactive: beneficiaries.filter((b) => !b.user?.is_active).length,
    pending:  beneficiaries.filter((b) => b.account_status === "pending").length,
  }), [beneficiaries]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteBeneficiary(toDelete.id);
      success("Beneficiary removed", `${toDelete.user?.full_name || "Beneficiary"} has been removed.`);
      refetch();
    } catch {
      toastError("Failed to remove beneficiary.");
    } finally {
      setToDelete(null);
    }
  };

  return {
    beneficiaries: filtered,
    loading,
    error,
    refetch,
    stats,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    accountFilter, setAccountFilter,
    toDelete,      setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
};

export default useBeneficiaryList;
