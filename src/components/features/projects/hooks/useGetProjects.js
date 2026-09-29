import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

// Loads every page of /projects (the endpoint is paginated).
// publishedOnly: for public-facing pages — admins/staff get drafts from the
// same endpoint, and those must not show up on the public site.
const useGetProjects = ({ publishedOnly = false } = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = [];
      for (let page = 1; ; page++) {
        const data = await projectService.getAll({ page });
        all.push(...(data.results ?? []));
        if (!data.next) break;
      }
      setProjects(publishedOnly ? all.filter((p) => p.is_published) : all);
    } catch (err) {
      setError(extractError(err, "Failed to load projects."));
    } finally {
      setLoading(false);
    }
  }, [publishedOnly]);

  useEffect(() => { refetch(); }, [refetch]);

  return { projects, loading, error, refetch };
};

export default useGetProjects;
