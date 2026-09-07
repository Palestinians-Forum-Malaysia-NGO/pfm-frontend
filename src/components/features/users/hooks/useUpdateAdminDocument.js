import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useUpdateAdminDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (userId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await userService.updateDocument(userId, id, payload);
    } catch (err) {
      const msg = extractError(err, "Failed to save document.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateAdminDocument;
