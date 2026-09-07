import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useUpdateStaffDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (staffId, id, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await staffService.updateDocument(staffId, id, payload);
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

export default useUpdateStaffDocument;
