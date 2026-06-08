import { useState } from "react";
import { memberService } from "../services/memberService";
import { extractError } from "components/features/auth/utils";

const useUpdateMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.update(id, payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to update member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateMember;
