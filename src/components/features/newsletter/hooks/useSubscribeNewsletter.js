import { useState } from "react";
import { newsletterService } from "../services/newsletterService";
import { extractError } from "components/features/auth/utils";

export function useSubscribeNewsletter() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (email) => {
    setLoading(true);
    setError(null);
    try {
      return await newsletterService.subscribe(email);
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
