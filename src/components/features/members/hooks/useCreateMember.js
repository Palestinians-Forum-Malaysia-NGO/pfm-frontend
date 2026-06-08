import { useState } from "react";
import { memberService } from "../services/memberService";
import { extractError } from "components/features/auth/utils";

const useCreateMember = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.create(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to create member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useCreateMember;
