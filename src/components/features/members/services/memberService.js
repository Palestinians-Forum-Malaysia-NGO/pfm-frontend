import api from "services/app";

export const memberService = {
  async getAll()              { const { data } = await api.get("/account/manage/members"); return data; },
  async getById(id)           { const { data } = await api.get(`/account/manage/members/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/account/manage/members", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/account/manage/members/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/account/manage/members/${id}`); },
};
