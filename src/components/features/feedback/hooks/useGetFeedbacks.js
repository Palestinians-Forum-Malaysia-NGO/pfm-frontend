import { useState, useEffect } from "react";
import { feedbackService } from "components/features/feedback/services/feedbackService";
import { extractError } from "components/features/auth/utils";

export function useGetFeedbacks(params = {}) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await feedbackService.getAll(params);
      setFeedbacks(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { feedbacks, loading, error, refetch };
}
