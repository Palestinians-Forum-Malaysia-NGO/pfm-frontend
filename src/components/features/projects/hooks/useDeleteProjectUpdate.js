import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useDeleteProjectUpdate = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, id) => {
    setLoading(true);
    setError(null);
    try {
      await projectService.deleteUpdate(projectId, id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete update.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteProjectUpdate;
