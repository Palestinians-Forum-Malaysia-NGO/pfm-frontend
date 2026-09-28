import { useState, useCallback } from "react";
import { applicationService } from "components/features/applications/services/applicationService";
import { extractError } from "components/features/auth/utils";

export function useGetApplicationDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (applicationId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getDocuments(applicationId);
      const results = data.results ?? data;
      setDocuments(results);
      return results;
    } catch (err) {
      setError(extractError(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, execute, loading, error };
}
