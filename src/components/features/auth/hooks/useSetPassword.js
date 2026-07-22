import { useState } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";

/**
 * POST /auth/password-change  (new_password only — first-time setup)
 * Returns: { execute, loading, error }
 */
const useSetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ new_password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.setPassword({ new_password });
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to set password. Please try again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useSetPassword;
