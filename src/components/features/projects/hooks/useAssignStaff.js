import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useAssignStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, userIds) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.assignStaff(id, userIds);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to assign staff.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useAssignStaff;
