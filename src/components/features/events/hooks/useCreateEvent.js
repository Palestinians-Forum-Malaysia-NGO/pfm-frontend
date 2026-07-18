import { useState } from "react";
import { eventService } from "../services/eventService";
import { extractError } from "components/features/auth/utils";

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      return await eventService.create(payload);
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
