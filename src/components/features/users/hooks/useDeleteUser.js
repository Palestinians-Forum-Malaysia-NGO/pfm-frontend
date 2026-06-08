import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useDeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await userService.remove(id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete user.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteUser;
