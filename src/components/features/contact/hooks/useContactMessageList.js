import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetContactMessages } from "./useGetContactMessages";
import { useDeleteContactMessage } from "./useDeleteContactMessage";
import { useToast } from "components/ui/toast/ToastContext";

export function useContactMessageList() {
  const { t } = useTranslation();
  const { messages: all, loading, error, refetch } = useGetContactMessages();
  const { execute: deleteMessage, loading: deleteLoading } = useDeleteContactMessage();
  const { success, error: toastError } = useToast();

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]       = useState(null);

  const messages = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((m) => m.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) =>
        m.full_name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.subject ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:     all.length,
    pending:   all.filter((m) => m.status === "pending").length,
    follow_up: all.filter((m) => m.status === "follow_up").length,
    closed:    all.filter((m) => m.status === "closed").length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteMessage(toDelete.id);
      success(t("contactMessages.toast_deleted"), t("contactMessages.toast_deleted_sub"));
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("contactMessages.toast_delete_failed"), err?.message);
    }
  };

  return {
    messages, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
  };
}
