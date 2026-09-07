import { useState } from "react";
import { categoryService } from "../services/categoryService";
import { extractError } from "components/features/auth/utils";

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.create(payload);
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
