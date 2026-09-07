import React from "react";
import ImageUploadField from "./ImageUploadField";
import { ERROR_MSG } from "../utils/fieldStyles";
import useStorageUpload from "./useStorageUpload";

/**
 * Smart image upload field backed by DigitalOcean Spaces.
 * Handles the full presigned-upload flow internally.
 *
 * Props:
 *   label                  – field label
 *   fileType               – "image" | "thumbnail"  (default: "image")
 *   folder                 – Spaces folder, e.g. "profiles", "projects" (ignored when publicEndpoint is set)
 *   publicEndpoint         – "register" | "opportunityApplication" — use a no-auth upload-url
 *                            endpoint instead of the staff/admin-only generic one
 *   currentUrl             – URL of the currently stored image (shown when no local file is staged)
 *   onUpload               – (fileKey: string | null) => void — called after upload OR removal
 *   onRemove               – () => void — called when the existing image is removed
 *   required               – show required asterisk
 *   errors                 – validation errors object (keyed by field name)
 *   field                  – key used to look up errors (default: "image")
 *   maxSizeMB              – max upload size shown/enforced (default: 2)
 *   recommendedDimensions  – e.g. "300×300", shown as a hint (default: "300×300")
 */
const StorageImageField = ({
  label,
  fileType = "image",
  folder,
  publicEndpoint,
  currentUrl,
  onUpload,
  onRemove,
  required = false,
  errors,
  field = "image",
  maxSizeMB = 2,
  recommendedDimensions = "300×300",
}) => {
  const { file, isUploading, progress, error, handleFileChange, handleRemove } =
    useStorageUpload({ fileType, folder, publicEndpoint, onUpload });

  // Use a Fragment — ImageUploadField already owns its mb-4 wrapper spacing.
  // The error message shows naturally after it with no negative-margin hacks.
  return (
    <>
      <ImageUploadField
        label={label}
        field={field}
        imageOnly
        required={required}
        errors={errors}
        simpleFile={file}
        onSimpleFileChange={handleFileChange}
        onSimpleRemove={handleRemove}
        simpleUploading={isUploading}
        simpleProgress={progress}
        existingUrl={!file ? currentUrl : null}
        onExistingRemove={onRemove}
        maxSizeMB={maxSizeMB}
        recommendedDimensions={recommendedDimensions}
      />
      {error && <p className={`mb-4 ${ERROR_MSG}`}>{error}</p>}
    </>
  );
};

export default StorageImageField;
