import { useState, useEffect, useCallback } from "react";
import { eventRegistrationService } from "components/features/eventRegistrations/services/eventRegistrationService";
import { extractError } from "components/features/auth/utils";

export function useGetEventRegistrations(eventId) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    if (!eventId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await eventRegistrationService.getAll(eventId);
      setRegistrations(data.results ?? []);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => { refetch(); }, [refetch]);

  return { registrations, loading, error, refetch };
}
