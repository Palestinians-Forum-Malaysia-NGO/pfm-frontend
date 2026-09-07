import { useState } from "react";
import authService      from "../services/authService";
import { setTokens }    from "../utils";
import { extractError } from "../utils";
import { OTP_PURPOSE }  from "../types";

/**
 * POST /auth/otp/verify/
 * Returns: { execute, loading, error }
 * execute({ email, code, purpose? }) → { detail, access, refresh }
 */
const useVerifyOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ email, code, purpose = OTP_PURPOSE.LOGIN }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.verifyOtp({ email, code, purpose });
      if (data.access) setTokens({ access: data.access, refresh: data.refresh });
      return data;
    } catch (err) {
      const msg = extractError(err, "Invalid or expired code. Please try again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useVerifyOtp;
