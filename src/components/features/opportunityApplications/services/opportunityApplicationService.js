import api from "services/app";

export const opportunityApplicationService = {
  async submit(opportunityId, payload) {
    const { data } = await api.post(`/opportunities/${opportunityId}/applications`, payload);
    return data;
  },
  async getAll(opportunityId, params = {}) {
    const { data } = await api.get(`/opportunities/${opportunityId}/applications`, { params });
    return data;
  },
  async getById(opportunityId, id) {
    const { data } = await api.get(`/opportunities/${opportunityId}/applications/${id}`);
    return data;
  },
  async update(opportunityId, id, payload) {
    const { data } = await api.patch(`/opportunities/${opportunityId}/applications/${id}`, payload);
    return data;
  },
  async remove(opportunityId, id) {
    await api.delete(`/opportunities/${opportunityId}/applications/${id}`);
  },
  async approve(opportunityId, id, note) {
    const { data } = await api.post(`/opportunities/${opportunityId}/applications/${id}/approve`, { note });
    return data;
  },
  async reject(opportunityId, id, note) {
    const { data } = await api.post(`/opportunities/${opportunityId}/applications/${id}/reject`, { note });
    return data;
  },
};
