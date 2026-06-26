import api from "services/app";

export const profileService = {
  async getMe() {
    const { data } = await api.get("/api/v1/accounts/me");
    return data;
  },

  async update(payload) {
    const { data } = await api.patch("/api/v1/accounts/me", payload);
    return data;
  },
};
