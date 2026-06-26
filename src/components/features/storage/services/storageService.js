import api from "services/app";

export const storageService = {
  /**
   * Step 1 — request presigned upload URL(s) from the backend.
   * @param {Array<{ file_name, content_type, file_type, folder }>} files
   * @returns {{ uploads: Array<{ upload_url, fields, file_key }> }}
   */
  async getPresignedUploadUrls(files) {
    const { data } = await api.post("/api/v1/storage/presigned-upload-urls", { files });
    return data;
  },

  /**
   * Step 2 — upload the file directly to DigitalOcean Spaces.
   * Uses plain fetch (no auth header — direct S3 POST).
   * The `file` must be appended LAST after all `fields`.
   */
  async uploadToSpaces(uploadUrl, fields, file) {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value));
    formData.append("file", file);
    const res = await fetch(uploadUrl, { method: "POST", body: formData });
    if (!res.ok) throw new Error(`Storage upload failed (${res.status})`);
  },

  /** Generate a presigned download URL for a private file (valid 1 hour). */
  async getPresignedDownloadUrl(fileKey) {
    const { data } = await api.post("/api/v1/storage/presigned-download-url", { file_key: fileKey });
    return data;
  },

  /** List all files under a folder path. */
  async listFiles(folder) {
    const { data } = await api.get("/api/v1/storage/list", { data: { folder } });
    return data;
  },

  /** Delete a file from storage and remove its FileRecord. */
  async deleteFile(fileKey) {
    await api.delete("/api/v1/storage/file", { data: { file_key: fileKey } });
  },
};
