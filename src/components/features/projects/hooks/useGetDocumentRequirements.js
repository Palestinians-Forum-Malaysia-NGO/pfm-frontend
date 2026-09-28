import { useState, useCallback } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useGetDocumentRequirements = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getDocumentRequirements(projectId);
      const results = data.results ?? data;
      setRequirements(results);
      return results;
    } catch (err) {
      setError(extractError(err, "Failed to load document requirements."));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { requirements, execute, loading, error };
};

export default useGetDocumentRequirements;
