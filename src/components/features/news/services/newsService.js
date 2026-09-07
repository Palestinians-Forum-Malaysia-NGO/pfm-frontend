import api from "services/app";

export const newsService = {
  async getAll(params = {})  { const { data } = await api.get("/news", { params }); return data; },
  async getById(idOrSlug)    { const { data } = await api.get(`/news/${idOrSlug}`); return data; },
  async create(payload)      { const { data } = await api.post("/news", payload); return data; },
  async update(id, payload)  { const { data } = await api.patch(`/news/${id}`, payload); return data; },
  async remove(id)           { await api.delete(`/news/${id}`); },
  async share(idOrSlug)      { const { data } = await api.post(`/news/${idOrSlug}/share`); return data; },
};
