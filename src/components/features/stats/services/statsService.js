import api from "services/app";

export const statsService = {
  async getStats() {
    const { data } = await api.get("/stats");
    return data;
  },
};
