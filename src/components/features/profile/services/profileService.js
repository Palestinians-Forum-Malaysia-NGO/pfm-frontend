import api from "services/app";

export const profileService = {
  async getMe() {
    const { data } = await api.get("/account/my-profile");
    return data;
  },

  async update(payload) {
    const { data } = await api.patch("/account/my-profile", payload);
    return data;
  },
};
