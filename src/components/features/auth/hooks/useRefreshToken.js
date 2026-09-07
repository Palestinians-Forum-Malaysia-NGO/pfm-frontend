import { useState } from "react";
import authService from "../services/authService";
import { setTokens } from "../utils";
import { extractError } from "../utils";

const useRefreshToken = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (refreshToken) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.refreshToken(refreshToken);
      setTokens({ access: data.access, refresh: data.refresh ?? refreshToken });
      return data;
    } catch (err) {
      const msg = extractError(err, "Session expired. Please sign in again.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useRefreshToken;
