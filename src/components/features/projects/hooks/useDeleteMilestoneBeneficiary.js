import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useDeleteMilestoneBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, milestoneId, id) => {
    setLoading(true);
    setError(null);
    try {
      await projectService.deleteMilestoneBeneficiary(projectId, milestoneId, id);
    } catch (err) {
      const msg = extractError(err, "Failed to remove beneficiary record.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteMilestoneBeneficiary;
