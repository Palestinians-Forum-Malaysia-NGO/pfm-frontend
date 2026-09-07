import { useState } from "react";
import { opportunityApplicationService } from "components/features/opportunityApplications/services/opportunityApplicationService";
import { extractError } from "components/features/auth/utils";

export function useDeleteOpportunityApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (opportunityId, id) => {
    setLoading(true);
    setError(null);
    try {
      await opportunityApplicationService.remove(opportunityId, id);
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
