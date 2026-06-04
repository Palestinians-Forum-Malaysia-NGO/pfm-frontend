import { useState } from "react";
import authService      from "../services/authService";
import { setTokens }    from "../utils";
import { extractError } from "../utils";

/**
 * POST /auth/register/
 * Returns: { execute, loading, error }
 * execute({ email, password }) → { detail, channel, requires_otp, access, refresh }
 */
const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.register({ email, password });
      if (data.access) setTokens({ access: data.access, refresh: data.refresh });
      return data;
    } catch (err) {
      const msg = extractError(err, "Registration failed. Please try again.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useRegister;
