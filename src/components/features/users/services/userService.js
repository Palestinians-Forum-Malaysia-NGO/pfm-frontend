import api from "services/app";

export const userService = {
  async getAll(params = {}) {
    const { data } = await api.get("/accounts/users", { params });
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/accounts/users/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/accounts/users", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/accounts/users/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/accounts/users/${id}`);
  },

  async getDocuments(userId)            { const { data } = await api.get(`/accounts/users/${userId}/admin-documents`); return data; },
  async createDocument(userId, payload) { const { data } = await api.post(`/accounts/users/${userId}/admin-documents`, payload); return data; },
  async updateDocument(userId, id, payload) { const { data } = await api.put(`/accounts/users/${userId}/admin-documents/${id}`, payload); return data; },
  async deleteDocument(userId, id)      { await api.delete(`/accounts/users/${userId}/admin-documents/${id}`); },
};
