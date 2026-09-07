import { useState, useEffect, useCallback } from "react";
import { profileService } from "../services/profileService";
import { extractError } from "components/features/auth/utils";

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.getMe();
      setProfile(data);
    } catch (err) {
      const msg = extractError(err, "Failed to load profile.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { profile, loading, error, refetch };
};

export default useProfile;
