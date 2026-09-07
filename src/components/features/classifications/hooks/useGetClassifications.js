import { useState, useEffect } from "react";
import { classificationService } from "components/features/beneficiaries/services/classificationService";
import { extractError } from "components/features/auth/utils";

export function useGetClassifications(params = {}) {
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await classificationService.getAll(params);
      setClassifications(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { classifications, loading, error, refetch };
}
