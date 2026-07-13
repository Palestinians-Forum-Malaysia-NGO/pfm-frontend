import api from "services/app";

export const feedbackService = {
  async getAll(params = {})  { const { data } = await api.get("/feedback", { params }); return data; },
  async getById(id)          { const { data } = await api.get(`/feedback/${id}`); return data; },
  async submit(payload)      { const { data } = await api.post("/feedback", payload); return data; },
  async update(id, payload)  { const { data } = await api.patch(`/feedback/${id}`, payload); return data; },
  async remove(id)           { await api.delete(`/feedback/${id}`); },
  async approve(id)          { const { data } = await api.post(`/feedback/${id}/approve`); return data; },
  async reject(id)           { const { data } = await api.post(`/feedback/${id}/reject`); return data; },
};
