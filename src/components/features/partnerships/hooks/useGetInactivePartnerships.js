import { useState, useEffect } from "react";
import { partnershipService } from "components/features/partnerships/services/partnershipService";
import { extractError } from "components/features/auth/utils";

export function useGetInactivePartnerships(params = {}) {
  const [partnerships, setPartnerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await partnershipService.getInactive(params);
      setPartnerships(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { partnerships, loading, error, refetch };
}
