import { useState } from "react";
import { blogService } from "../services/blogService";
import { extractError } from "components/features/auth/utils";

export function useDeleteBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await blogService.remove(id);
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
