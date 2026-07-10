import { useState } from "react";
import { branchService } from "components/features/branches/services/branchService";
import { extractError } from "components/features/auth/utils";

export function useGetBranch() {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await branchService.getById(id);
      setBranch(data);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { branch, execute, loading, error };
}
