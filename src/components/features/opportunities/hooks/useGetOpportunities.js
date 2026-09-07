import { useState, useEffect, useCallback } from "react";
import { opportunityService } from "components/features/opportunities/services/opportunityService";
import { extractError } from "components/features/auth/utils";

export function useGetOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getAll();
      setOpportunities(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { opportunities, loading, error, refetch };
}
