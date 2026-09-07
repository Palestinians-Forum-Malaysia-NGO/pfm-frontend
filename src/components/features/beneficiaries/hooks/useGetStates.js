import { useState, useEffect } from "react";
import { stateService } from "../services/stateService";
import { extractError } from "components/features/auth/utils";

const useGetStates = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    stateService.getAll()
      .then((data) => setStates(data.results ?? data))
      .catch((err) => setError(extractError(err)))
      .finally(() => setLoading(false));
  }, []);

  return { states, loading, error };
};

export default useGetStates;
