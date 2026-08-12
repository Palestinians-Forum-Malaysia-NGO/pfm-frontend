import { useState, useCallback } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

const useGetAdminDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getDocuments(userId);
      const results = data.results ?? data;
      setDocuments(results);
      return results;
    } catch (err) {
      setError(extractError(err));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, execute, loading, error };
};

export default useGetAdminDocuments;
