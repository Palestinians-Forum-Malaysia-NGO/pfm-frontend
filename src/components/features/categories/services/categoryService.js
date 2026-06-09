import api from "services/app";

export const categoryService = {
  async getAll() {
    const { data } = await api.get("/category");
    return data;
  },
  async getById(id) {
    const { data } = await api.get(`/category/${id}`);
    return data;
  },
  async create(payload) {
    const { data } = await api.post("/category", payload);
    return data;
  },
  async update(id, payload) {
    const { data } = await api.patch(`/category/${id}`, payload);
    return data;
  },
  async remove(id) {
    await api.delete(`/category/${id}`);
  },
};
