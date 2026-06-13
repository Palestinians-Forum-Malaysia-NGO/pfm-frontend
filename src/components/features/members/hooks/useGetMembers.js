import { useState, useEffect, useCallback } from "react";
import { memberService } from "../services/memberService";
import { extractError } from "components/features/auth/utils";

const useGetMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await memberService.getAll();
      setMembers(data.results ?? []);
    } catch (err) {
      setError(extractError(err, "Failed to load members."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { members, loading, error, refetch };
};

export default useGetMembers;
