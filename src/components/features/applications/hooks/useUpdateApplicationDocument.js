import { useState } from "react";
import { applicationService } from "components/features/applications/services/applicationService";
import { extractError } from "components/features/auth/utils";

export function useUpdateApplicationDocument() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (applicationId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await applicationService.updateDocument(applicationId, id, payload);
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
