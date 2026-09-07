import { useState, useEffect } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useGetBeneficiaryStats = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    beneficiaryService.getStats()
      .then(setStats)
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
};

export default useGetBeneficiaryStats;
