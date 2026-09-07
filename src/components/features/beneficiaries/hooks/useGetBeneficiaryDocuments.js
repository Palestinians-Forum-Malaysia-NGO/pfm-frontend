import { useState, useCallback } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useGetBeneficiaryDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (beneficiaryId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.getDocuments(beneficiaryId);
      const results = data.results ?? data;
      setDocuments(results);
      return results;
    } catch (err) {
      setError(extractError(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, execute, loading, error };
};

export default useGetBeneficiaryDocuments;
