import { useState } from "react";
import { classificationService } from "components/features/beneficiaries/services/classificationService";
import { extractError } from "components/features/auth/utils";

export function useGetClassification() {
  const [classification, setClassification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await classificationService.getById(id);
      setClassification(data);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { classification, execute, loading, error };
}
