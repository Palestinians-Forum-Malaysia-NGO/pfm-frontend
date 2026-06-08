import api from "services/app";

export const userService = {
  async getAll() {
    const { data } = await api.get("/account/manage/users");
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/account/manage/users/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/account/manage/users", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/account/manage/users/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/account/manage/users/${id}`);
  },
};
