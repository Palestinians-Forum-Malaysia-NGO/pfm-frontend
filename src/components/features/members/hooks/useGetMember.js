import { useState } from "react";
import { memberService } from "../services/memberService";
import { extractError } from "components/features/auth/utils";

const useGetMember = () => {
  const [member, setMember]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getById(id);
      setMember(data);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to load member.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { member, execute, loading, error };
};

export default useGetMember;
