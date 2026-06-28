import api from "services/app";

export const classificationService = {
  async getAll(params = {}) { const { data } = await api.get("/accounts/classifications", { params }); return data; },
};
