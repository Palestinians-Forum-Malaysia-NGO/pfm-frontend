import { useState, useEffect, useCallback } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useGetProjects = (params = {}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const queryKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getAll(JSON.parse(queryKey));
      setProjects(data.results ?? []);
    } catch (err) {
      setError(extractError(err, "Failed to load projects."));
    } finally {
      setLoading(false);
    }
  }, [queryKey]);

  useEffect(() => { refetch(); }, [refetch]);

  return { projects, loading, error, refetch };
};

export default useGetProjects;
