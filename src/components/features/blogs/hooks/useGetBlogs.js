import { useState, useEffect, useCallback } from "react";
import { blogService } from "../services/blogService";
import { extractError } from "components/features/auth/utils";

export function useGetBlogs(params = {}) {
  const [blogs, setBlogs]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogService.getAll(params);
      setBlogs(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refetch(); }, [refetch]);

  return { blogs, loading, error, refetch };
}
