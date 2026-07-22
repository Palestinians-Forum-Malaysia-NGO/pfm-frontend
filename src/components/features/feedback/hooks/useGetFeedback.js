import { useState } from "react";
import { feedbackService } from "components/features/feedback/services/feedbackService";
import { extractError } from "components/features/auth/utils";

export function useGetFeedback() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getById(id);
      setFeedback(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { feedback, execute, loading, error };
}
