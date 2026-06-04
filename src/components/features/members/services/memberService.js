import api from "services/app";

export const memberService = {
  /** GET /members/ */
  async getAll() {
    const { data } = await api.get("/members/");
    return data;
  },

  /** GET /members/:id/ */
  async getById(id) {
    const { data } = await api.get(`/members/${id}/`);
    return data;
  },

  /** POST /members/ */
  async create(payload) {
    const { data } = await api.post("/members/", payload);
    return data;
  },

  /** PATCH /members/:id/ */
  async update(id, payload) {
    const { data } = await api.patch(`/members/${id}/`, payload);
    return data;
  },

  /** DELETE /members/:id/ */
  async remove(id) {
    await api.delete(`/members/${id}/`);
  },
};
