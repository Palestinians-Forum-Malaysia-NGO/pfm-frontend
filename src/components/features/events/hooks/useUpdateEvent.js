import { useState } from "react";
import { eventService } from "../services/eventService";
import { extractError } from "components/features/auth/utils";

export function useUpdateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await eventService.update(id, payload);
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
