import { useState } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";

/**
 * POST /auth/password-reset/
 * Returns: { execute, loading, error }
 * execute({ email, otp, new_password }) → { detail }
 */
const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.resetPassword(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Reset failed. Check your code and try again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useResetPassword;
