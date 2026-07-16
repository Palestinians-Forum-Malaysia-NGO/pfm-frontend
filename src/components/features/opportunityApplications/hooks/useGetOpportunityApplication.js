import { useState } from "react";
import { opportunityApplicationService } from "components/features/opportunityApplications/services/opportunityApplicationService";
import { extractError } from "components/features/auth/utils";

export function useGetOpportunityApplication() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (opportunityId, id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await opportunityApplicationService.getById(opportunityId, id);
      setApplication(data);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { application, execute, loading, error };
}
