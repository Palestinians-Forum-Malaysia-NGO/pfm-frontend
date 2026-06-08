import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useCreateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.create(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to create staff member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateStaff;
