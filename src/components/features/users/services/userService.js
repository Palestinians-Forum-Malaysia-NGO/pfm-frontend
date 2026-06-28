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
};
