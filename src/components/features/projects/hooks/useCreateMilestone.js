import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useCreateMilestone = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.createMilestone(projectId, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to create milestone.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateMilestone;
