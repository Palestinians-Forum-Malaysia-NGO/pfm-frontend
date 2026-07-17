import { useState, useEffect, useCallback } from "react";
import { newsService } from "../services/newsService";
import { extractError } from "components/features/auth/utils";

export function useGetNewsArticles(params = {}) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsService.getAll(params);
      setArticles(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { refetch(); }, [refetch]);

  return { articles, loading, error, refetch };
}
