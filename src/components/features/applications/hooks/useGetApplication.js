import { useState } from "react";
import { applicationService } from "components/features/applications/services/applicationService";
import { extractError } from "components/features/auth/utils";

export function useGetApplication() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await applicationService.getById(id);
      setApplication(data);
      return data;
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  return { application, execute, loading, error };
}
