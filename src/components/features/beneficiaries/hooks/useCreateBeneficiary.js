import { useState } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useCreateBeneficiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.create(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to create beneficiary.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateBeneficiary;
