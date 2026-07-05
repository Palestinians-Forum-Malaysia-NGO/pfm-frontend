import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import useGetProjects from "./useGetProjects";
import useDeleteProject from "./useDeleteProject";
import usePublishProject from "./usePublishProject";
import useUnpublishProject from "./useUnpublishProject";
import { useToast } from "components/ui/toast/ToastContext";

const useProjectList = () => {
  const { t } = useTranslation();
  const { projects, loading, error, refetch } = useGetProjects();
  const { execute: deleteProject,    loading: deleteLoading  } = useDeleteProject();
  const { execute: publishProject,   loading: publishLoading } = usePublishProject();
  const { execute: unpublishProject                          } = useUnpublishProject();
  const { success, error: toastError } = useToast();

  const [search,        setSearch]        = useState("");
  const [statusFilter,  setStatusFilter]  = useState("all");
  const [publishFilter, setPublishFilter] = useState("all");
  const [toDelete,      setToDelete]      = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return projects.filter((p) => {
      const matchSearch  = !q
        || p.title?.toLowerCase().includes(q)
        || (p.title_ar ?? "").toLowerCase().includes(q)
        || (p.summary ?? "").toLowerCase().includes(q)
        || (p.summary_ar ?? "").toLowerCase().includes(q)
        || p.category?.name?.toLowerCase().includes(q)
        || (p.category?.name_ar ?? "").toLowerCase().includes(q);
      const matchStatus  = statusFilter === "all"  || p.status === statusFilter;
      const matchPublish = publishFilter === "all"
        || (publishFilter === "published"   &&  p.is_published)
        || (publishFilter === "unpublished" && !p.is_published);
      return matchSearch && matchStatus && matchPublish;
    });
  }, [projects, search, statusFilter, publishFilter]);

  const stats = useMemo(() => ({
    total:     projects.length,
    active:    projects.filter((p) => p.status === "active").length,
    published: projects.filter((p) => p.is_published).length,
    completed: projects.filter((p) => p.status === "completed").length,
  }), [projects]);

  const handleDeleteConfirm = async () => {
    if (!toDelete) return;
    try {
      await deleteProject(toDelete.id);
      success(t("projects.toast_deleted"), `"${toDelete.title}" ${t("projects.toast_deleted_sub")}`);
      refetch();
    } catch {
      toastError(t("projects.toast_delete_failed"));
    } finally {
      setToDelete(null);
    }
  };

  const handleTogglePublish = async (project) => {
    try {
      if (project.is_published) {
        await unpublishProject(project.id);
        success(t("projects.toast_unpublished"), `"${project.title}" ${t("projects.toast_unpublished_sub")}`);
      } else {
        await publishProject(project.id);
        success(t("projects.toast_published"), `"${project.title}" ${t("projects.toast_published_sub")}`);
      }
      refetch();
    } catch {
      toastError(t("projects.toast_publish_failed"));
    }
  };

  return {
    projects: filtered,
    loading,
    error,
    refetch,
    stats,
    search,        setSearch,
    statusFilter,  setStatusFilter,
    publishFilter, setPublishFilter,
    toDelete,      setToDelete,
    deleteLoading,
    publishLoading,
    handleDeleteConfirm,
    handleTogglePublish,
  };
};

export default useProjectList;
