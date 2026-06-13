import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const usePublishProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.publish(id);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to publish project.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default usePublishProject;
