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
      // The API returns a bare array here, unlike every other list endpoint's
      // {count, next, previous, results} envelope — handle both shapes.
      const list = Array.isArray(data) ? data : (data.results ?? []);
      setBeneficiaries(list);
      setCount(Array.isArray(data) ? list.length : (data.count ?? 0));
      setHasNext(Array.isArray(data) ? false : !!data.next);
      setHasPrev(Array.isArray(data) ? false : !!data.previous);
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
