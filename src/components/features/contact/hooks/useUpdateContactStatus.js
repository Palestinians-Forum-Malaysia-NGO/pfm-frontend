import { useState } from "react";
import { contactService } from "components/features/contact/services/contactService";
import { extractError } from "components/features/auth/utils";

export function useUpdateContactStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id, status) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.updateStatus(id, status);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
