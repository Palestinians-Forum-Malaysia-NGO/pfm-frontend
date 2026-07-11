import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useUnassignStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, userIds) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.unassignStaff(id, userIds);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to unassign staff.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUnassignStaff;
