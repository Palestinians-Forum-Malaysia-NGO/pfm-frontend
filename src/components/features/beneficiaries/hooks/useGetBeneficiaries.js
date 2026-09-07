import { useState, useEffect, useCallback } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useGetBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.getAll();
      setBeneficiaries(data.results ?? []);
    } catch (err) {
      setError(extractError(err, "Failed to load beneficiaries."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { beneficiaries, loading, error, refetch };
};

export default useGetBeneficiaries;
