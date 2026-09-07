import { useState, useEffect } from "react";
import { applicationService } from "components/features/applications/services/applicationService";
import { extractError } from "components/features/auth/utils";

export function useGetApplications(params = {}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getAll(params);
      setApplications(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { applications, loading, error, refetch };
}
