import { useState } from "react";
import { eventRegistrationService } from "components/features/eventRegistrations/services/eventRegistrationService";
import { extractError } from "components/features/auth/utils";

export function useDeleteEventRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (eventId, id) => {
    setLoading(true);
    setError(null);
    try {
      await eventRegistrationService.remove(eventId, id);
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
