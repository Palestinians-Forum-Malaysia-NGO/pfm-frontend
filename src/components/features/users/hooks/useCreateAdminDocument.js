import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useCreateAdminDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (userId, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await userService.createDocument(userId, payload);
    } catch (err) {
      const msg = extractError(err, "Failed to add document.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateAdminDocument;
