import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useCreateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.create(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to create user.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateUser;
