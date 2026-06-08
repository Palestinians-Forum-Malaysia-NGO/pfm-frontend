import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.update(id, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to update user.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateUser;
