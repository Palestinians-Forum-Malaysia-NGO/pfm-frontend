import api from "services/app";

export const eventRegistrationService = {
  async getAll(eventId, params = {}) {
    const { data } = await api.get(`/events/${eventId}/registrations`, { params });
    return data;
  },
  async create(eventId, payload) {
    const { data } = await api.post(`/events/${eventId}/registrations`, payload);
    return data;
  },
  async update(eventId, id, payload) {
    const { data } = await api.patch(`/events/${eventId}/registrations/${id}`, payload);
    return data;
  },
  async remove(eventId, id) {
    await api.delete(`/events/${eventId}/registrations/${id}`);
  },
};
