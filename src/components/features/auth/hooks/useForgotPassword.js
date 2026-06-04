import { useState } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";

/**
 * POST /auth/password-forgot/
 * Returns: { execute, loading, error }
 * execute({ email }) → { detail }
 */
const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ email }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.forgotPassword({ email });
      return data;
    } catch (err) {
      const msg = extractError(err, "Could not send reset email. Please try again.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useForgotPassword;
