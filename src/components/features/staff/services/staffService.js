import api from "services/app";

export const staffService = {
  async getAll()              { const { data } = await api.get("/account/manage/staff"); return data; },
  async getById(id)           { const { data } = await api.get(`/account/manage/staff/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/account/manage/staff", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/account/manage/staff/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/account/manage/staff/${id}`); },
};
