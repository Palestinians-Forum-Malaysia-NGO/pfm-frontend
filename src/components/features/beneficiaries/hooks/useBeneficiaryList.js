import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useGetBeneficiaries from "./useGetBeneficiaries";
import useGetBeneficiaryStats from "./useGetBeneficiaryStats";
import useDeleteBeneficiary from "./useDeleteBeneficiary";
import { useToast } from "components/ui/toast/ToastContext";

const useBeneficiaryList = () => {
  const { t } = useTranslation();
  const { beneficiaries, loading, error, refetch } = useGetBeneficiaries();
  const { stats: apiStats, loading: statsLoading } = useGetBeneficiaryStats();
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
        (b.user?.full_name    ?? "").toLowerCase().includes(q) ||
        (b.user?.full_name_ar ?? "").toLowerCase().includes(q) ||
        (b.user?.email        ?? "").toLowerCase().includes(q) ||
        (b.passport_number    ?? "").toLowerCase().includes(q) ||
        (b.classification?.name    ?? "").toLowerCase().includes(q) ||
        (b.classification?.name_ar ?? "").toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active"   &&  b.user?.is_active) ||
        (statusFilter === "inactive" && !b.user?.is_active);

      const matchesAccount =
        accountFilter === "all" || b.account_status === accountFilter;

      return matchesSearch && matchesStatus && matchesAccount;
    });
  }, [beneficiaries, search, statusFilter, accountFilter]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteBeneficiary(toDelete.id);
      success(
        t("beneficiaries.toast_removed"),
        `${toDelete.user?.full_name || ""} ${t("beneficiaries.toast_removed_sub")}`,
      );
      refetch();
    } catch {
      toastError(t("beneficiaries.toast_remove_failed"));
    } finally {
      setToDelete(null);
    }
  };

  return {
    beneficiaries: filtered,
    loading,
    error,
    refetch,
    apiStats,
    statsLoading,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    accountFilter, setAccountFilter,
    toDelete,      setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
};

export default useBeneficiaryList;
