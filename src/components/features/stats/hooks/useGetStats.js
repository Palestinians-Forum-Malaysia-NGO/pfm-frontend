import { useState, useEffect, useCallback } from "react";
import { statsService } from "components/features/stats/services/statsService";
import { extractError } from "components/features/auth/utils";

export function useGetStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await statsService.getStats();
      setStats(data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { stats, loading, error, refetch };
}
