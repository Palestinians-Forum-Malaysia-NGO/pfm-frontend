import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetInactivePartnerships } from "./useGetInactivePartnerships";
import { useRestorePartnership } from "./useRestorePartnership";
import { useToast } from "components/ui/toast/ToastContext";

export function useInactivePartnershipList() {
  const { t } = useTranslation();
  const { partnerships: all, loading, error, refetch } = useGetInactivePartnerships();
  const { execute: restorePartnership, loading: restoreLoading } = useRestorePartnership();
  const { success, error: toastError } = useToast();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const partnerships = useMemo(() => {
    let list = all;
    if (typeFilter !== "all") list = list.filter((p) => p.partnership_type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return list;
  }, [all, search, typeFilter]);

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
    partnerships, loading, error,
    search, setSearch,
    typeFilter, setTypeFilter,
    restoreLoading,
    handleRestore,
  };
}
