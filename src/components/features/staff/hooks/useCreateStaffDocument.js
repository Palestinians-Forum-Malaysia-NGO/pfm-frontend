import { useState } from "react";
import { staffService } from "../services/staffService";
import { extractError } from "components/features/auth/utils";

const useCreateStaffDocument = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (staffId, payload) => {
    setLoading(true);
    setError(null);
    try {
      return await staffService.createDocument(staffId, payload);
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

export default useCreateStaffDocument;
