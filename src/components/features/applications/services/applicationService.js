import api from "services/app";

export const applicationService = {
  async getAll(params = {})   { const { data } = await api.get("/applications", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/applications/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/applications", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/applications/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/applications/${id}`); },
  async approve(id, note)     { const { data } = await api.post(`/applications/${id}/approve`, { note }); return data; },
  async reject(id, note)      { const { data } = await api.post(`/applications/${id}/reject`, { note }); return data; },
};
