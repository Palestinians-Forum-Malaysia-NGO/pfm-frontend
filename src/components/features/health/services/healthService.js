import api from "services/app";

export const healthService = {
  async check() {
    const { data } = await api.get("/health");
    return data;
  },
};
