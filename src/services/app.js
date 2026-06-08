import axios from "axios";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "components/features/auth/utils";

const BASE_URL = process.env.REACT_APP_API_URL || "https://pfm-backend-production-eb4a.up.railway.app/api/v1";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/* ── Request interceptor — attach access token ── */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor — handle 401, auto-refresh ── */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Skip refresh logic for auth endpoints — a 401 there means wrong credentials,
    // not an expired token. Let the error propagate to the caller.
    const isAuthEndpoint = original.url?.includes("/auth/");
    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      const refresh = getRefreshToken();

      if (refresh) {
        try {
          const { data } = await axios.post(`${BASE_URL}/auth/token/refresh`, { refresh });
          setTokens({ access: data.access, refresh: data.refresh ?? refresh });
          original.headers.Authorization = `Bearer ${data.access}`;
          return api(original);
        } catch {
          clearTokens();
          window.location.href = "/auth/sign-in";
        }
      } else {
        window.location.href = "/auth/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
