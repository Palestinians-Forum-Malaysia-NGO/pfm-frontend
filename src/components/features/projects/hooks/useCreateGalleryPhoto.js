import { useState } from "react";
import { projectService } from "../services/projectService";
import { extractError } from "components/features/auth/utils";

const useCreateGalleryPhoto = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (projectId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await projectService.createGalleryPhoto(projectId, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to add photo.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateGalleryPhoto;
