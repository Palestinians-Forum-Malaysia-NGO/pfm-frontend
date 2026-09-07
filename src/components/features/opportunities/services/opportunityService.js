import api from "services/app";

export const opportunityService = {
  async getAll(params = {})  { const { data } = await api.get("/opportunities", { params }); return data; },
  async getById(id)          { const { data } = await api.get(`/opportunities/${id}`); return data; },
  async create(payload)      { const { data } = await api.post("/opportunities", payload); return data; },
  async update(id, payload)  { const { data } = await api.patch(`/opportunities/${id}`, payload); return data; },
  async remove(id)           { await api.delete(`/opportunities/${id}`); },
};
