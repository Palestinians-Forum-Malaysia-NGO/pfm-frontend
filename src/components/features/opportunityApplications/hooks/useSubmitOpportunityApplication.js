import { useState } from "react";
import { opportunityApplicationService } from "components/features/opportunityApplications/services/opportunityApplicationService";
import { extractError } from "components/features/auth/utils";

export function useSubmitOpportunityApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (opportunityId, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityApplicationService.submit(opportunityId, payload);
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
