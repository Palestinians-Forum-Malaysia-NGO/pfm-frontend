import { useState, useCallback } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useGetUser = () => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getById(id);
      setUser(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load user.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, execute, loading, error };
};

export default useGetUser;
