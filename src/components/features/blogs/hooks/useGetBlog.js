import { useState } from "react";
import { blogService } from "../services/blogService";
import { extractError } from "components/features/auth/utils";

export function useGetBlog() {
  const [blog, setBlog]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (idOrSlug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getById(idOrSlug);
      setBlog(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { blog, execute, loading, error };
}
