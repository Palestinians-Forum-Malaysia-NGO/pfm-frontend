import { useState, useMemo } from "react";
import useGetProjects from "./useGetProjects";
import useDeleteProject from "./useDeleteProject";
import usePublishProject from "./usePublishProject";
import useUnpublishProject from "./useUnpublishProject";
import { useToast } from "components/ui/toast/ToastContext";

const useProjectList = () => {
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
      const matchSearch  = !q || p.title?.toLowerCase().includes(q) || p.category?.name?.toLowerCase().includes(q);
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
      success("Project deleted", `"${toDelete.title}" has been removed.`);
      refetch();
    } catch {
      toastError("Failed to delete project.");
    } finally {
      setToDelete(null);
    }
  };

  const handleTogglePublish = async (project) => {
    try {
      if (project.is_published) {
        await unpublishProject(project.id);
        success("Unpublished", `"${project.title}" is now hidden from the public.`);
      } else {
        await publishProject(project.id);
        success("Published", `"${project.title}" is now live.`);
      }
      refetch();
    } catch {
      toastError("Failed to update publish status.");
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
