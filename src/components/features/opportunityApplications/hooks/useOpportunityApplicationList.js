import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useGetOpportunityApplications } from "./useGetOpportunityApplications";
import { useDeleteOpportunityApplication } from "./useDeleteOpportunityApplication";
import { useApproveOpportunityApplication } from "./useApproveOpportunityApplication";
import { useToast } from "components/ui/toast/ToastContext";

export function useOpportunityApplicationList(opportunityId) {
  const { t } = useTranslation();
  const { applications: all, loading, error, refetch } = useGetOpportunityApplications(opportunityId);
  const { execute: deleteApplication, loading: deleteLoading } = useDeleteOpportunityApplication();
  const { execute: approveApplication } = useApproveOpportunityApplication();
  const { success, error: toastError } = useToast();

  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toDelete, setToDelete]       = useState(null);

  const applications = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((a) => a.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) =>
        a.applicant_full_name.toLowerCase().includes(q) ||
        a.applicant_email.toLowerCase().includes(q)
      );
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    pending:  all.filter((a) => a.status === "pending").length,
    approved: all.filter((a) => a.status === "approved").length,
    rejected: all.filter((a) => a.status === "rejected").length,
  }), [all]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteApplication(opportunityId, toDelete.id);
      success(t("opportunityApplications.toast_deleted"), t("opportunityApplications.toast_deleted_sub"));
      setToDelete(null);
      refetch();
    } catch (err) {
      toastError(t("opportunityApplications.toast_delete_failed"), err?.message);
    }
  };

  const handleQuickApprove = async (application) => {
    try {
      await approveApplication(opportunityId, application.id, application.note ?? "");
      success(t("opportunityApplications.toast_approved"), t("opportunityApplications.toast_approved_sub"));
      refetch();
    } catch (err) {
      toastError(t("opportunityApplications.toast_approve_failed"), err?.message);
    }
  };

  return {
    applications, loading, error, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
    toDelete, setToDelete,
    deleteLoading,
    handleDeleteConfirm,
    handleQuickApprove,
  };
}
