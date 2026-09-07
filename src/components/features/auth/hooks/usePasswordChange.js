import { useState } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";

/**
 * POST /auth/password-change/
 * Returns: { execute, loading, error }
 * execute({ old_password, new_password }) → { detail }
 */
const usePasswordChange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ old_password, new_password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.changePassword({ old_password, new_password });
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to change password. Please try again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default usePasswordChange;
