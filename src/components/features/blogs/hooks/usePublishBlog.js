import { useState } from "react";
import { blogService } from "../services/blogService";
import { extractError } from "components/features/auth/utils";

export function usePublishBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      return await blogService.publish(id);
    } catch (err) {
      const msg = extractError(err, "Failed to publish blog.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
