import { useState } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useDeleteBeneficiaryDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (beneficiaryId, id) => {
    setLoading(true);
    setError(null);
    try {
      await beneficiaryService.deleteDocument(beneficiaryId, id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete document.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteBeneficiaryDocument;
