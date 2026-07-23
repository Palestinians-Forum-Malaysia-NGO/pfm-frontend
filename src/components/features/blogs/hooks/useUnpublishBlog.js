import { useState } from "react";
import { blogService } from "../services/blogService";
import { extractError } from "components/features/auth/utils";

export function useUnpublishBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.unpublish(id);
    } catch (err) {
      const msg = extractError(err, "Failed to unpublish blog.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
