import { useState, useEffect } from "react";
import { branchService } from "components/features/branches/services/branchService";
import { extractError } from "components/features/auth/utils";

export function useGetBranches(params = {}) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await branchService.getAll(params);
      setBranches(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { branches, loading, error, refetch };
}
