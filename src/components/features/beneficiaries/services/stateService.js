import api from "services/app";

export const stateService = {
  async getAll() { const { data } = await api.get("/accounts/states"); return data; },
};
