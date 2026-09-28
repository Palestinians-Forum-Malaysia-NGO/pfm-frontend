import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useUpdateDocumentRequirement = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await projectService.updateDocumentRequirement(projectId, id, payload);
    } catch (err) {
      const msg = extractError(err, "Failed to save document requirement.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateDocumentRequirement;
