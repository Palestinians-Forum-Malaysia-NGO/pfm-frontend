import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useGetMilestoneBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, milestoneId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getMilestoneBeneficiaries(projectId, milestoneId);
      setBeneficiaries(data.results ?? data);
      return data;
    } catch (err) {
      setError(extractError(err, "Failed to load beneficiaries."));
    } finally {
      setLoading(false);
    }
  };

  return { beneficiaries, execute, loading, error };
};

export default useGetMilestoneBeneficiaries;
