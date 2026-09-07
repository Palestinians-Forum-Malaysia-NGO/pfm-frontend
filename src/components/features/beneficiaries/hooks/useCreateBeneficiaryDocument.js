import { useState } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useCreateBeneficiaryDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (beneficiaryId, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await beneficiaryService.createDocument(beneficiaryId, payload);
    } catch (err) {
      const msg = extractError(err, "Failed to add document.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateBeneficiaryDocument;
