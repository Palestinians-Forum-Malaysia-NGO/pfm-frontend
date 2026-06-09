import { useState } from "react";
import { categoryService } from "../services/categoryService";
import { extractError } from "components/features/auth/utils";

export function useGetCategory() {
  const [category, setCategory] = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const execute = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoryService.getById(id);
      setCategory(data);
      return data;
    } catch (err) {
      setError(extractError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { category, execute, loading, error };
}
