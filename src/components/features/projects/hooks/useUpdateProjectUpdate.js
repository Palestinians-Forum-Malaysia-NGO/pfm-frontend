import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useUpdateProjectUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.updateUpdate(projectId, id, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to update post.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateProjectUpdate;
