import { useState, useEffect } from "react";
import { contactService } from "components/features/contact/services/contactService";
import { extractError } from "components/features/auth/utils";

export function useGetContactMessages(params = {}) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await contactService.getAll(params);
      setMessages(data.results ?? data);
    } catch (err) {
      setError(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refetch(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return { messages, loading, error, refetch };
}
