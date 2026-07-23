import { useState, useCallback, useRef, useEffect } from "react";
import useFileUpload from "components/features/storage/hooks/useFileUpload";

/**
 * Manages local file state and auto-uploads to DigitalOcean Spaces when
 * the user selects a file. Pairs with StorageImageField / StorageDocumentField.
 *
 * @param {{ fileType: string, folder: string, publicEndpoint?: string, onUpload?: (key: string|null) => void }} opts
 */
const useStorageUpload = ({ fileType, folder, publicEndpoint, onUpload }) => {
  const [file, setFile] = useState(null);
  const { upload, loading, error, progress, reset } = useFileUpload({ fileType, folder, publicEndpoint });

  // Keep the latest onUpload in a ref so callbacks don't need it as a dep.
  // This prevents handleFileChange / handleRemove from being recreated on
  // every parent render just because the parent passes an inline arrow.
  const onUploadRef = useRef(onUpload);
  useEffect(() => { onUploadRef.current = onUpload; }, [onUpload]);

  const handleFileChange = useCallback(async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    try {
      const key = await upload(selectedFile);
      onUploadRef.current?.(key);
    } catch {
      // error state is set inside useFileUpload
    }
  }, [upload]); // upload is stable (useCallback in useFileUpload)

  const handleRemove = useCallback(() => {
    setFile(null);
    reset();
    onUploadRef.current?.(null);
  }, [reset]); // reset is stable too

  return {
    file,
    isUploading: loading,
    progress,
    error,
    handleFileChange,
    handleRemove,
  };
};

export default useStorageUpload;
