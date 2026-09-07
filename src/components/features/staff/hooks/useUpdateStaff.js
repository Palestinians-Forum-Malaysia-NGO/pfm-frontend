import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useUpdateStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.update(id, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to update staff member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateStaff;
