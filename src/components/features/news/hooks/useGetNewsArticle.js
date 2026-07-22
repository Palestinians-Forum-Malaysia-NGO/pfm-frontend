import { useState } from "react";
import { newsService } from "../services/newsService";
import { extractError } from "components/features/auth/utils";

export function useGetNewsArticle() {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (idOrSlug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsService.getById(idOrSlug);
      setArticle(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { article, execute, loading, error };
}
