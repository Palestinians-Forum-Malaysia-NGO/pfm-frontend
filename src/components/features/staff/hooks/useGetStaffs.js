import { useState, useEffect, useCallback } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useGetStaffs = () => {
  const [staffs, setStaffs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getAll();
      setStaffs(data);
    } catch (err) {
      setError(extractError(err, "Failed to load staff."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { staffs, loading, error, refetch };
};

export default useGetStaffs;
