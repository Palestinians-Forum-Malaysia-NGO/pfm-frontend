import { useState } from "react";
import { memberService } from "../services/memberService";
import { extractError } from "components/features/auth/utils";

const useDeleteMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await memberService.remove(id);
    } catch (err) {
      const msg = extractError(err, "Failed to delete member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useDeleteMember;
