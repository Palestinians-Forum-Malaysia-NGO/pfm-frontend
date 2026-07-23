import api from "services/app";

export const storageService = {
  async getPresignedUploadUrls(files) {
    const { data } = await api.post("/storage/presigned-upload-urls", { files });
    return data;
  },

  // Public (no-auth) upload-url endpoints — used by unauthenticated flows
  // (beneficiary registration, opportunity applications) where the generic
  // /storage/presigned-upload-urls endpoint would 401.
  async getRegisterUploadUrl({ file_name, content_type, file_type }) {
    const { data } = await api.post("/auth/register/upload-url", { file_name, content_type, file_type });
    return data;
  },

  async getOpportunityApplicationUploadUrl({ file_name, content_type, file_type }) {
    const { data } = await api.post("/opportunities/applications/upload-url", { file_name, content_type, file_type });
    return data;
  },

  async uploadToSpaces(uploadUrl, fields, file) {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("file", file);
    const res = await fetch(uploadUrl, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Storage upload failed (${res.status})`);
  },

  async getPresignedDownloadUrl(fileKey) {
    const { data } = await api.post("/storage/presigned-download-url", { file_key: fileKey });
    return data;
  },

  async listFiles(folder) {
    const { data } = await api.get("/storage/list", { data: { folder } });
    return data;
  },

  async deleteFile(fileKey) {
    await api.delete("/storage/file", { data: { file_key: fileKey } });
  },
};
