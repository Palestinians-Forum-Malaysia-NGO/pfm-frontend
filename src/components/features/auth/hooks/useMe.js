import { useState, useCallback } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";

/**
 * GET /auth/me/
 * Returns: { execute, loading, error, user }
 * execute() → { email, full_name, role }
 */
const useMe = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [user, setUser]       = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.getMe();
      setUser(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load user profile.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error, user };
};

export default useMe;
