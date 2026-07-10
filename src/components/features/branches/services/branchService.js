import api from "services/app";

export const branchService = {
  async getAll(params = {})   { const { data } = await api.get("/branches", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/branches/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/branches", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/branches/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/branches/${id}`); },
};
