import { useState } from "react";
import { eventRegistrationService } from "components/features/eventRegistrations/services/eventRegistrationService";
import { extractError } from "components/features/auth/utils";

export function useCreateEventRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (eventId, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await eventRegistrationService.create(eventId, payload);
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
