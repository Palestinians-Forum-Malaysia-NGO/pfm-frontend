import { useState } from "react";
import { newsletterService } from "../services/newsletterService";
import { extractError } from "components/features/auth/utils";

export function useUnsubscribeNewsletter() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (token) => {
    setLoading(true);
    setError(null);
    try {
      return await newsletterService.unsubscribe(token);
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
