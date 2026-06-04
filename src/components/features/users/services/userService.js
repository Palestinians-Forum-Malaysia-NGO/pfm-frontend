import api from "services/app";

export const userService = {
  /** GET /users/ */
  async getAll() {
    const { data } = await api.get("/users/");
    return data;
  },

  /** GET /users/:id/ */
  async getById(id) {
    const { data } = await api.get(`/users/${id}/`);
    return data;
  },

  /** POST /users/ */
  async create(payload) {
    const { data } = await api.post("/users/", payload);
    return data;
  },

  /** PATCH /users/:id/ */
  async update(id, payload) {
    const { data } = await api.patch(`/users/${id}/`, payload);
    return data;
  },

  /** DELETE /users/:id/ */
  async remove(id) {
    await api.delete(`/users/${id}/`);
  },
};
