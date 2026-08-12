import api from "services/app";

export const staffService = {
  async getAll()              { const { data } = await api.get("/accounts/staff"); return data; },
  async getById(id)           { const { data } = await api.get(`/accounts/staff/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/accounts/staff", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/accounts/staff/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/accounts/staff/${id}`); },

  async getDocuments(staffId)            { const { data } = await api.get(`/accounts/staff/${staffId}/documents`); return data; },
  async createDocument(staffId, payload) { const { data } = await api.post(`/accounts/staff/${staffId}/documents`, payload); return data; },
  async updateDocument(staffId, id, payload) { const { data } = await api.put(`/accounts/staff/${staffId}/documents/${id}`, payload); return data; },
  async deleteDocument(staffId, id)      { await api.delete(`/accounts/staff/${staffId}/documents/${id}`); },
};
