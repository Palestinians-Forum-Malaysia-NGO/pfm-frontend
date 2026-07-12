import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useUpdateMilestoneBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, milestoneId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.updateMilestoneBeneficiary(projectId, milestoneId, id, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to save beneficiary record.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateMilestoneBeneficiary;
