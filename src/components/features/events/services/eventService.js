import api from "services/app";

export const eventService = {
  async getAll(params = {}) { const { data } = await api.get("/events", { params }); return data; },
  async getById(idOrSlug)   { const { data } = await api.get(`/events/${idOrSlug}`); return data; },
  async create(payload)     { const { data } = await api.post("/events", payload); return data; },
  async update(id, payload) { const { data } = await api.patch(`/events/${id}`, payload); return data; },
  async remove(id)          { await api.delete(`/events/${id}`); },
};
