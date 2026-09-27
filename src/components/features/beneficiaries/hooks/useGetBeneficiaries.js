import { useState, useEffect, useCallback } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useGetBeneficiaries = (params = {}) => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // Keyed on the serialised params so a fresh `{}` each render doesn't refetch.
  const paramsKey = JSON.stringify(params);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.getAll(JSON.parse(paramsKey));
      setBeneficiaries(data.results ?? []);
    } catch (err) {
      setError(extractError(err, "Failed to load beneficiaries."));
    } finally {
      setLoading(false);
    }
  }, [paramsKey]);

  useEffect(() => { refetch(); }, [refetch]);

  return { beneficiaries, loading, error, refetch };
};

export default useGetBeneficiaries;
