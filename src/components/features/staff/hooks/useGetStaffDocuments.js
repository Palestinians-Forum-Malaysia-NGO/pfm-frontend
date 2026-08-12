import { useState, useCallback } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useGetStaffDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (staffId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getDocuments(staffId);
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

export default useGetStaffDocuments;
