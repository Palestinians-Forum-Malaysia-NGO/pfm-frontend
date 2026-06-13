import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useCreateProjectUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.createUpdate(projectId, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to post update.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateProjectUpdate;
