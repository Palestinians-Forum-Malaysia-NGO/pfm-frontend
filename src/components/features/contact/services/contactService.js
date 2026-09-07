import api from "services/app";

export const contactService = {
  async getAll(params = {})   { const { data } = await api.get("/contact", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/contact/${id}`); return data; },
  async submit(payload)       { const { data } = await api.post("/contact", payload); return data; },
  async updateStatus(id, status) { const { data } = await api.patch(`/contact/${id}`, { status }); return data; },
  async remove(id)            { await api.delete(`/contact/${id}`); },
};
