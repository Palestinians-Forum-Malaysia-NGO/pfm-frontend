import { useState } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError, extractFieldError } from "components/features/auth/utils";

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
      const thrown = new Error(msg);
      // Attached directly (not read back from hook state) so the caller can
      // use it synchronously in its own catch block — hook state wouldn't
      // have re-rendered yet at that point.
      thrown.fieldError = extractFieldError(err);
      throw thrown;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateBeneficiary;
