import { useState, useEffect, useCallback } from "react";
import { healthService } from "../services/healthService";

const useHealth = ({ autoCheck = true, interval = null } = {}) => {
  const [status, setStatus]   = useState(null);   // "ok" | "error" | null
  const [latency, setLatency] = useState(null);   // ms
  const [data, setData]       = useState(null);   // raw response
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const check = useCallback(async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const result = await healthService.check();
      setLatency(Date.now() - start);
      setData(result);
      setStatus("ok");
      return result;
    } catch (err) {
      setLatency(Date.now() - start);
      setStatus("error");
      setError(err?.response?.data?.detail ?? err?.message ?? "Backend unreachable");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-check on mount
  useEffect(() => {
    if (autoCheck) check();
  }, [autoCheck, check]);

  // Optional polling interval (ms)
  useEffect(() => {
    if (!interval) return;
    const id = setInterval(check, interval);
    return () => clearInterval(id);
  }, [interval, check]);

  return { status, latency, data, loading, error, check };
};

export default useHealth;
