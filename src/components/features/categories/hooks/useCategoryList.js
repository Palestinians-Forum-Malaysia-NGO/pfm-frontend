import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetCategories } from "./useGetCategories";
import { useDeleteCategory } from "./useDeleteCategory";
import { useToast } from "components/ui/toast/ToastContext";

export function useCategoryList() {
  const { t } = useTranslation();
  const { categories: allCategories, loading, error, refetch } = useGetCategories();
  const { execute: deleteCategory, loading: deleteLoading }    = useDeleteCategory();
  const { success, error: toastError }                         = useToast();

  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [toDelete,     setToDelete]     = useState(null);

  const categories = useMemo(() => {
    let list = allCategories;
    if (statusFilter === "active")   list = list.filter((c) => c.is_active);
    if (statusFilter === "inactive") list = list.filter((c) => !c.is_active);
    if (moduleFilter !== "all")      list = list.filter((c) => c.module === moduleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.name_ar ?? "").toLowerCase().includes(q) ||
          (c.description ?? "").toLowerCase().includes(q) ||
          (c.description_ar ?? "").toLowerCase().includes(q) ||
          (c.slug ?? "").toLowerCase().includes(q) ||
          (c.module ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [allCategories, search, statusFilter, moduleFilter]);

  const stats = useMemo(() => ({
    total:    allCategories.length,
    active:   allCategories.filter((c) => c.is_active).length,
    inactive: allCategories.filter((c) => !c.is_active).length,
  }), [allCategories]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteCategory(toDelete.id);
      success(t("categories.toast_deleted"), `"${toDelete.name}" ${t("categories.toast_deleted_sub")}`);
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("categories.toast_delete_failed"), err?.message);
    }
  };

  return {
    categories, loading, error,
    stats,
    search,       setSearch,
    statusFilter, setStatusFilter,
    moduleFilter, setModuleFilter,
    toDelete,     setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
}
