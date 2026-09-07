import api from "services/app";

export const classificationService = {
  async getAll(params = {})   { const { data } = await api.get("/accounts/classifications", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/accounts/classifications/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/accounts/classifications", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/accounts/classifications/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/accounts/classifications/${id}`); },
};
