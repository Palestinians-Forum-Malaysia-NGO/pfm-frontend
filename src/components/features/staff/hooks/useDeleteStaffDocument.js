import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useDeleteStaffDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (staffId, id) => {
    setLoading(true);
    setError(null);
    try {
      await staffService.deleteDocument(staffId, id);
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

export default useDeleteStaffDocument;
