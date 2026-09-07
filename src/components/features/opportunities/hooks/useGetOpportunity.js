import { useState } from "react";
import { opportunityService } from "components/features/opportunities/services/opportunityService";
import { extractError } from "components/features/auth/utils";

export function useGetOpportunity() {
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityService.getById(id);
      setOpportunity(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { opportunity, execute, loading, error };
}
