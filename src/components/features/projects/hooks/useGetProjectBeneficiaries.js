import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useGetProjectBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [count, setCount]     = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getProjectBeneficiaries(projectId, params);
      setBeneficiaries(data.results ?? []);
      setCount(data.count ?? 0);
      setHasNext(!!data.next);
      setHasPrev(!!data.previous);
      return data;
    } catch (err) {
      setError(extractError(err, "Failed to load beneficiaries."));
    } finally {
      setLoading(false);
    }
  };

  return { beneficiaries, count, hasNext, hasPrev, execute, loading, error };
};

export default useGetProjectBeneficiaries;
