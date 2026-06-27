import api from "services/app";

export const projectService = {
  // Projects
  async getAll(params = {})   { const { data } = await api.get("/projects", { params }); return data; },
  async getById(id)           { const { data } = await api.get(`/projects/${id}`); return data; },
  async create(payload)       { const { data } = await api.post("/projects", payload); return data; },
  async update(id, payload)   { const { data } = await api.patch(`/projects/${id}`, payload); return data; },
  async remove(id)            { await api.delete(`/projects/${id}`); },
  async publish(id)           { const { data } = await api.post(`/projects/${id}/publish`); return data; },
  async unpublish(id)         { const { data } = await api.post(`/projects/${id}/unpublish`); return data; },
  // Milestones
  async getMilestones(projectId)                   { const { data } = await api.get(`/projects/${projectId}/milestones`); return data; },
  async createMilestone(projectId, payload)        { const { data } = await api.post(`/projects/${projectId}/milestones`, payload); return data; },
  async updateMilestone(projectId, id, payload)   { const { data } = await api.patch(`/projects/${projectId}/milestones/${id}`, payload); return data; },
  async deleteMilestone(projectId, id)             { await api.delete(`/projects/${projectId}/milestones/${id}`); },
  // Updates
  async getUpdates(projectId)                      { const { data } = await api.get(`/projects/${projectId}/updates`); return data; },
  async createUpdate(projectId, payload)           { const { data } = await api.post(`/projects/${projectId}/updates`, payload); return data; },
  async updateUpdate(projectId, id, payload)       { const { data } = await api.patch(`/projects/${projectId}/updates/${id}`, payload); return data; },
  async deleteUpdate(projectId, id)                { await api.delete(`/projects/${projectId}/updates/${id}`); },
};
