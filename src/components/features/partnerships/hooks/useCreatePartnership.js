import { useState } from "react";
import { partnershipService } from "components/features/partnerships/services/partnershipService";
import { extractError } from "components/features/auth/utils";

export function useCreatePartnership() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await partnershipService.create(payload);
      return data;
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
