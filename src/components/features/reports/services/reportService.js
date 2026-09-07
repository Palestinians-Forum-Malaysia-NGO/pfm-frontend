import api from "services/app";

export const reportService = {
  async exportOrganizationReport() {
    const { data } = await api.get("/admin-panel/reports/organization/export", { responseType: "blob" });
    return data;
  },
};
