import api from "services/app";

const authService = {
  login: async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },

  verifyOtp: async ({ email, code, purpose = "login" }) => {
    const { data } = await api.post("/auth/otp/verify", { email, code, purpose });
    return data;
  },

  resendOtp: async ({ email, purpose = "login" }) => {
    const { data } = await api.post("/auth/otp/resend", { email, purpose });
    return data;
  },

  getMe: async () => {
    const { data } = await api.get("/auth/me");
    return data;
  },

  register: async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },

  forgotPassword: async ({ email }) => {
    const { data } = await api.post("/auth/password-forgot", { email });
    return data;
  },

  resetPassword: async (payload) => {
    const { data } = await api.post("/auth/password-reset", payload);
    return data;
  },

  changePassword: async (payload) => {
    const { data } = await api.post("/auth/password-change", payload);
    return data;
  },

  refreshToken: async (refresh) => {
    const { data } = await api.post("/auth/token/refresh", { refresh });
    return data;
  },
};

export default authService;
