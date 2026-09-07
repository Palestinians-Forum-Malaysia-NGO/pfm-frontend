import { useState } from "react";
import { newsletterService } from "../services/newsletterService";
import { extractError } from "components/features/auth/utils";

export function useGetNotification() {
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsletterService.getNotification(id);
      setNotification(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { notification, execute, loading, error };
}
