import { useState } from "react";
import authService      from "../services/authService";
import { extractError } from "../utils";
import { OTP_PURPOSE }  from "../types";

/**
 * POST /auth/otp/resend/
 * Returns: { execute, loading, error }
 * execute({ email, purpose? }) → { detail, channel }
 */
const useResendOtp = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async ({ email, purpose = OTP_PURPOSE.LOGIN }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.resendOtp({ email, purpose });
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to resend code. Please try again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useResendOtp;
