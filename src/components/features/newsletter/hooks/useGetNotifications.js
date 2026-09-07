import { useState, useEffect } from "react";
import { newsletterService } from "../services/newsletterService";
import { extractError } from "components/features/auth/utils";

export function useGetNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsletterService.getNotifications();
      setNotifications(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { notifications, loading, error, refetch };
}
