import api from "services/app";

export const memberService = {
  async getAll() {
    const { data } = await api.get("/members");
    return data;
  },

  async getById(id) {
    const { data } = await api.get(`/members/${id}`);
    return data;
  },

  async create(payload) {
    const { data } = await api.post("/members", payload);
    return data;
  },

  async update(id, payload) {
    const { data } = await api.patch(`/members/${id}`, payload);
    return data;
  },

  async remove(id) {
    await api.delete(`/members/${id}`);
  },
};
