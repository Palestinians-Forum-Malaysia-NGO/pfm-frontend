import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetFeedbacks } from "./useGetFeedbacks";
import { useDeleteFeedback } from "./useDeleteFeedback";
import { useApproveFeedback } from "./useApproveFeedback";
import { useToast } from "components/ui/toast/ToastContext";

export function useFeedbackList() {
  const { t } = useTranslation();
  const { feedbacks: all, loading, error, refetch } = useGetFeedbacks();
  const { execute: deleteFeedback, loading: deleteLoading } = useDeleteFeedback();
  const { execute: approveFeedback } = useApproveFeedback();
  const { success, error: toastError } = useToast();

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]       = useState(null);

  const feedbacks = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((f) => f.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((f) =>
        f.full_name.toLowerCase().includes(q) ||
        (f.message ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    pending:  all.filter((f) => f.status === "pending").length,
    approved: all.filter((f) => f.status === "approved").length,
    rejected: all.filter((f) => f.status === "rejected").length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteFeedback(toDelete.id);
      success(t("feedbackMessages.toast_deleted"), t("feedbackMessages.toast_deleted_sub"));
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("feedbackMessages.toast_delete_failed"), err?.message);
    }
  };

  const handleQuickApprove = async (feedback) => {
    try {
      await approveFeedback(feedback.id);
      success(t("feedbackMessages.toast_approved"), t("feedbackMessages.toast_approved_sub"));
      refetch();
    } catch (err) {
      toastError(t("feedbackMessages.toast_approve_failed"), err?.message);
    }
  };

  return {
    feedbacks, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    handleQuickApprove,
  };
}
