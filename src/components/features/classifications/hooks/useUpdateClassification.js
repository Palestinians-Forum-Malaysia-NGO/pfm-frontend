import { useState } from "react";
import { classificationService } from "components/features/beneficiaries/services/classificationService";
import { extractError } from "components/features/auth/utils";

export function useUpdateClassification() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await classificationService.update(id, payload);
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
