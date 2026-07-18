import { useState } from "react";
import { eventService } from "../services/eventService";
import { extractError } from "components/features/auth/utils";

export function useGetEvent() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (idOrSlug) => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getById(idOrSlug);
      setEvent(data);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { event, execute, loading, error };
}
