import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetOpportunities } from "./useGetOpportunities";
import { useDeleteOpportunity } from "./useDeleteOpportunity";
import { useToast } from "components/ui/toast/ToastContext";

export function useOpportunityList() {
  const { t } = useTranslation();
  const { opportunities: all, loading, error, refetch } = useGetOpportunities();
  const { execute: deleteOpportunity, loading: deleteLoading } = useDeleteOpportunity();
  const { success, error: toastError } = useToast();

  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("all");
  const [visibilityFilter, setVisibilityFilter] = useState("all");
  const [toDelete, setToDelete]       = useState(null);

  const opportunities = useMemo(() => {
    let list = all;
    if (typeFilter !== "all") list = list.filter((o) => o.type === typeFilter);
    if (visibilityFilter !== "all") list = list.filter((o) => (visibilityFilter === "public" ? o.for_public : !o.for_public));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.title.toLowerCase().includes(q));
    }
    return list;
  }, [all, search, typeFilter, visibilityFilter]);

  const stats = useMemo(() => ({
    total:   all.length,
    public:  all.filter((o) => o.for_public).length,
    private: all.filter((o) => !o.for_public).length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteOpportunity(toDelete.id);
      success(t("opportunities.toast_deleted"), `"${toDelete.title}" ${t("opportunities.toast_deleted_sub")}`);
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("opportunities.toast_delete_failed"), err?.message);
    }
  };

  return {
    opportunities, loading, error, stats,
    search, setSearch,
    typeFilter, setTypeFilter,
    visibilityFilter, setVisibilityFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
}
