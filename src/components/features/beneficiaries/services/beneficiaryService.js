import api from "services/app";

export const beneficiaryService = {
  async getAll()              { const { data } = await api.get("/accounts/beneficiaries"); return data; },
  async getById(id)           { const { data } = await api.get(`/accounts/beneficiaries/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/accounts/beneficiaries", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/accounts/beneficiaries/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/accounts/beneficiaries/${id}`); },
};
