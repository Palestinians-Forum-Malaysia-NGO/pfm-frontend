import { useState } from "react";
import { beneficiaryService } from "../services/beneficiaryService";
import { extractError } from "components/features/auth/utils";

const useGetBeneficiary = () => {
  const [beneficiary, setBeneficiary] = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await beneficiaryService.getById(id);
      setBeneficiary(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load beneficiary.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { beneficiary, execute, loading, error };
};

export default useGetBeneficiary;
