import api from "services/app";

export const beneficiaryService = {
  async getAll(params = {})   { const { data } = await api.get("/accounts/beneficiaries", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/accounts/beneficiaries/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/accounts/beneficiaries", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/accounts/beneficiaries/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/accounts/beneficiaries/${id}`); },
  async getStats()            { const { data } = await api.get("/accounts/beneficiaries/stats"); return data; },

  async getDocuments(beneficiaryId)            { const { data } = await api.get(`/accounts/beneficiaries/${beneficiaryId}/documents`); return data; },
  async createDocument(beneficiaryId, payload) { const { data } = await api.post(`/accounts/beneficiaries/${beneficiaryId}/documents`, payload); return data; },
  async updateDocument(beneficiaryId, id, payload) { const { data } = await api.put(`/accounts/beneficiaries/${beneficiaryId}/documents/${id}`, payload); return data; },
  async deleteDocument(beneficiaryId, id)      { await api.delete(`/accounts/beneficiaries/${beneficiaryId}/documents/${id}`); },
};
