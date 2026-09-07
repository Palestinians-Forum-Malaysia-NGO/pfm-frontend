import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useDeleteMilestone = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, id) => {
    setLoading(true);
    setError(null);
    try {
      await projectService.deleteMilestone(projectId, id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete milestone.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteMilestone;
