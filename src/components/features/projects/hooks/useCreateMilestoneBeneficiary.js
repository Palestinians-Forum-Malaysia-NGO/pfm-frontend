import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useCreateMilestoneBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, milestoneId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.createMilestoneBeneficiary(projectId, milestoneId, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to record beneficiary.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateMilestoneBeneficiary;
