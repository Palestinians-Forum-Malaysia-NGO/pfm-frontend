import { useState } from "react";
import authService      from "../services/authService";
import { setTokens }    from "../utils";
import { extractError } from "../utils";

/**
 * POST /auth/login/
 * Returns: { execute, loading, error }
 * execute({ email, password }) → { requires_otp, channel, access, refresh }
 */
const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login({ email, password });
      setTokens({ access: data.access, refresh: data.refresh });
      return data;
    } catch (err) {
      const msg = extractError(err, "Invalid email or password.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useLogin;
