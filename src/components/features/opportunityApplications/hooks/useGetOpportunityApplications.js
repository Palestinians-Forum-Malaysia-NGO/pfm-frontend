import { useState, useEffect, useCallback } from "react";
import { opportunityApplicationService } from "components/features/opportunityApplications/services/opportunityApplicationService";
import { extractError } from "components/features/auth/utils";

export function useGetOpportunityApplications(opportunityId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    if (!opportunityId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityApplicationService.getAll(opportunityId);
      setApplications(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [opportunityId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { applications, loading, error, refetch };
}
