import { useState } from "react";
import { newsService } from "../services/newsService";
import { extractError } from "components/features/auth/utils";

export function useShareNews() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (idOrSlug) => {
    setLoading(true);
    setError(null);
    try {
      return await newsService.share(idOrSlug);
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
