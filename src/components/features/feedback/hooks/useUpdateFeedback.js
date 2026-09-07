import { useState } from "react";
import { feedbackService } from "components/features/feedback/services/feedbackService";
import { extractError } from "components/features/auth/utils";

export function useUpdateFeedback() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.update(id, payload);
      return data;
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
