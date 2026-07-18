import api from "services/app";

export const partnershipService = {
  async getAll(params = {})   { const { data } = await api.get("/partnerships", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/partnerships/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/partnerships", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/partnerships/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/partnerships/${id}`); },
  async restore(id)           { const { data } = await api.patch(`/partnerships/${id}`, { is_active: true }); return data; },
};
