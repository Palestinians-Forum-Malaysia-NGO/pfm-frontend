import { useState } from "react";
import { opportunityService } from "components/features/opportunities/services/opportunityService";
import { extractError } from "components/features/auth/utils";

export function useDeleteOpportunity() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await opportunityService.remove(id);
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
