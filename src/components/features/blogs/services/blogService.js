import api from "services/app";

export const blogService = {
  async getAll(params = {})  { const { data } = await api.get("/blogs", { params }); return data; },
  async getById(idOrSlug)    { const { data } = await api.get(`/blogs/${idOrSlug}`); return data; },
  async create(payload)      { const { data } = await api.post("/blogs", payload); return data; },
  async update(id, payload)  { const { data } = await api.patch(`/blogs/${id}`, payload); return data; },
  async remove(id)           { await api.delete(`/blogs/${id}`); },
  async publish(id)          { const { data } = await api.post(`/blogs/${id}/publish`); return data; },
  async unpublish(id)        { const { data } = await api.post(`/blogs/${id}/unpublish`); return data; },
};
