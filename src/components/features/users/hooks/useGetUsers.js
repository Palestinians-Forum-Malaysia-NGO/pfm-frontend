import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useGetUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      const msg = extractError(err, "Failed to load users.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { users, loading, error, refetch };
};

export default useGetUsers;
