import api from "services/app";

export const staffService = {
  async getAll()              { const { data } = await api.get("/accounts/staff"); return data; },
  async getById(id)           { const { data } = await api.get(`/accounts/staff/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/accounts/staff", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/accounts/staff/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/accounts/staff/${id}`); },
};
