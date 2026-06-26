import { useState, useCallback } from "react";
import { storageService } from "../services/storageService";
import { extractError } from "components/features/auth/utils";

/**
 * Handles the full 3-step presigned-upload workflow:
 *   1. Request presigned URL from backend
 *   2. Upload file directly to DigitalOcean Spaces
 *   3. Return file_key to caller for persisting on the model
 *
 * @param {{ fileType: string, folder: string }} options
 *   fileType — "image" | "thumbnail" | "document" | "pdf" | "video" | "file"
 *   folder   — e.g. "profiles", "projects", "cvs"
 */
const useFileUpload = ({ fileType, folder }) => {
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [progress, setProgress] = useState(0);

  const upload = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setProgress(10);
    try {
      const { uploads } = await storageService.getPresignedUploadUrls([{
        file_name:    file.name,
        content_type: file.type,
        file_type:    fileType,
        folder,
      }]);
      const { upload_url, fields, file_key } = uploads[0];
      setProgress(40);

      await storageService.uploadToSpaces(upload_url, fields, file);
      setProgress(100);

      return file_key;
    } catch (err) {
      const msg = extractError(err, "Upload failed. Please try again.");
      setError(msg);
      setProgress(0);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [fileType, folder]); // only re-create when config changes

  const deleteFile = useCallback(async (fileKey) => {
    try {
      await storageService.deleteFile(fileKey);
    } catch (err) {
      throw new Error(extractError(err, "Failed to delete file."));
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
  }, []);

  return { upload, deleteFile, loading, error, progress, reset };
};

export default useFileUpload;
