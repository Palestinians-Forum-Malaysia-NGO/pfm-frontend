import { useState, useMemo } from "react";
import { useGetClassifications }  from "./useGetClassifications";
import { useDeleteClassification } from "./useDeleteClassification";
import { useToast } from "components/ui/toast/ToastContext";

export function useClassificationList() {
  const { classifications: all, loading, error, refetch } = useGetClassifications();
  const { execute: deleteClassification, loading: deleteLoading } = useDeleteClassification();
  const { success, error: toastError } = useToast();

  const [search,   setSearch]   = useState("");
  const [toDelete, setToDelete] = useState(null);

  const classifications = useMemo(() => {
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      (c.description ?? "").toLowerCase().includes(q)
    );
  }, [all, search]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteClassification(toDelete.id);
      success("Classification deleted", `"${toDelete.name}" has been removed.`);
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError("Failed to delete classification", err?.message);
    }
  };

  return {
    classifications, loading, error,
    total: all.length,
    search,   setSearch,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
}
