import api from "services/app";

export const profileService = {
  async getMe() {
    const { data } = await api.get("/accounts/me");
    return data;
  },

  async update(payload) {
    const { data } = await api.patch("/accounts/me", payload);
    return data;
  },
};
