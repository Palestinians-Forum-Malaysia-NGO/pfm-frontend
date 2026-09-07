import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useGetStaff = () => {
  const [staff, setStaff]     = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getById(id);
      setStaff(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load staff member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { staff, execute, loading, error };
};

export default useGetStaff;
