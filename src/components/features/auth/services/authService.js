import api from "services/app";

const authService = {
  /** POST /auth/login/ */
  login: async ({ email, password }) => {
    const { data } = await api.post("/auth/login/", { email, password });
    return data;
    // Returns: { detail, channel, requires_otp, access, refresh }
  },

  /** POST /auth/otp/verify/ */
  verifyOtp: async ({ email, otp, purpose = "login" }) => {
    const { data } = await api.post("/auth/otp/verify/", { email, otp, purpose });
    return data;
  },

  /** POST /auth/otp/resend/ */
  resendOtp: async ({ email, purpose = "login" }) => {
    const { data } = await api.post("/auth/otp/resend/", { email, purpose });
    return data;
    // Returns: { detail, channel }
  },

  /** GET /auth/me/ */
  getMe: async () => {
    const { data } = await api.get("/auth/me/");
    return data;
    // Returns: { email, full_name, role }
  },

  /** POST /auth/register/ */
  register: async (payload) => {
    const { data } = await api.post("/auth/register/", payload);
    return data;
  },

  /** POST /auth/password-forgot/ */
  forgotPassword: async ({ email }) => {
    const { data } = await api.post("/auth/password-forgot/", { email });
    return data;
  },

  /** POST /auth/password-reset/ */
  resetPassword: async (payload) => {
    const { data } = await api.post("/auth/password-reset/", payload);
    return data;
  },

  /** POST /auth/password-change/ */
  changePassword: async (payload) => {
    const { data } = await api.post("/auth/password-change/", payload);
    return data;
  },
};

export default authService;
