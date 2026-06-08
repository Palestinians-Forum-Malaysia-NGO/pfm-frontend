import { useState } from "react";
import { profileService } from "../services/profileService";
import { extractError } from "components/features/auth/utils";

const useUpdateProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await profileService.update(payload);
      return data;
    } catch (err) {
      const msg = extractError(err, "Failed to update profile.");
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};

export default useUpdateProfile;
