import { useState } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useDeleteAdminDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (userId, id) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteDocument(userId, id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete document.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteAdminDocument;
