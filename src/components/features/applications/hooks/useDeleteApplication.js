import { useState } from "react";
import { applicationService } from "components/features/applications/services/applicationService";
import { extractError } from "components/features/auth/utils";

export function useDeleteApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await applicationService.remove(id);
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
