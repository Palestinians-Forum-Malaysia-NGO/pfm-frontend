import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useGetProject = () => {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.getById(id);
      setProject(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load project.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { project, execute, loading, error };
};

export default useGetProject;
