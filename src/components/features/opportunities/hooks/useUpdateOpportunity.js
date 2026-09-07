import { useState } from "react";
import { opportunityService } from "components/features/opportunities/services/opportunityService";
import { extractError } from "components/features/auth/utils";

export function useUpdateOpportunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.update(id, payload);
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
