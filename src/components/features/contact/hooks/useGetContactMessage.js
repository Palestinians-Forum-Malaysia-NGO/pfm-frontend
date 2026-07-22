import { useState } from "react";
import { contactService } from "components/features/contact/services/contactService";
import { extractError } from "components/features/auth/utils";

export function useGetContactMessage() {
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getById(id);
      setMessage(data);
      return data;
    } catch (err) {
      const msg = extractError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { message, execute, loading, error };
}
