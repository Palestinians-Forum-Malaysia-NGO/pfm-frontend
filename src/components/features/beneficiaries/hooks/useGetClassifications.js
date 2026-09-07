import { useState, useEffect } from "react";
import { classificationService } from "../services/classificationService";
import { extractError } from "components/features/auth/utils";

const useGetClassifications = () => {
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    classificationService.getAll()
      .then((data) => setClassifications(data.results ?? data))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  return { classifications, loading, error };
};

export default useGetClassifications;
