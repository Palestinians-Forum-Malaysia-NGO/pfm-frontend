import api from "services/app";

export const newsletterService = {
  async subscribe(email)         { const { data } = await api.post("/newsletter/subscribe", { email }); return data; },
  async unsubscribe(token)       { const { data } = await api.post(`/newsletter/unsubscribe/${token}`); return data; },
  async getSubscribers(params = {})   { const { data } = await api.get("/newsletter/subscribers", { params }); return data; },
  async getNotifications(params = {}) { const { data } = await api.get("/newsletter/notifications", { params }); return data; },
  async getNotification(id)      { const { data } = await api.get(`/newsletter/notifications/${id}`); return data; },
};
