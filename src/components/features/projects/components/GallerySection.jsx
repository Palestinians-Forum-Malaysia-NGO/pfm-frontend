import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPhotoLibrary, MdAdd, MdDeleteOutline, MdEdit, MdCheck, MdClose } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";
import { StorageCoverField } from "components/form";
import StorageImage from "components/ui/StorageImage";
import {
  useCreateGalleryPhoto, useUpdateGalleryPhoto, useDeleteGalleryPhoto,
} from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";

export default function GallerySection({ projectId, initialGallery = [] }) {
  const { t } = useTranslation();
  const [photos, setPhotos] = useState(initialGallery);

  // Add state
  const [addOpen, setAddOpen] = useState(false);
  const [newImageKey, setNewImageKey] = useState(null);
  const [newCaption, setNewCaption] = useState("");

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editImageKey, setEditImageKey] = useState(null);
  const [editImageObj, setEditImageObj] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const { url: editCurrentUrl } = useStorageUrl(editImageObj);

  const { execute: createPhoto, loading: creating } = useCreateGalleryPhoto();
  const { execute: updatePhoto, loading: saving   } = useUpdateGalleryPhoto();
  const { execute: deletePhoto, loading: deleting } = useDeleteGalleryPhoto();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const resetAddForm = () => { setAddOpen(false); setNewImageKey(null); setNewCaption(""); };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newImageKey) return;
    try {
      const created = await createPhoto(projectId, { image: newImageKey, caption: newCaption || undefined });
      setPhotos((prev) => [created, ...prev]);
      resetAddForm();
      success(t("projects.toast_photo_added"));
    } catch (err) {
      toastError(t("projects.toast_photo_add_failed"), err?.message);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditImageKey(null);
    setEditImageObj(p.image || null);
    setEditCaption(p.caption || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageKey(null);
    setEditImageObj(null);
    setEditCaption("");
  };

  const handleSave = async (id) => {
    try {
      const payload = { caption: editCaption };
      if (editImageKey) payload.image = editImageKey;
      const updated = await updatePhoto(projectId, id, payload);
      setPhotos((prev) => prev.map((p) => (p.id === id ? updated : p)));
      cancelEdit();
      success(t("projects.toast_photo_saved"));
    } catch (err) {
      toastError(t("projects.toast_photo_save_failed"), err?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePhoto(projectId, id);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      success(t("projects.toast_photo_removed"));
    } catch (err) {
      toastError(t("projects.toast_photo_remove_failed"), err?.message);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <FormHeader icon={<MdPhotoLibrary className="h-5 w-5" />} title={t("projects.gallery_title")} subtitle={t("projects.gallery_subtitle")} />
        <Button
          variant="ghost"
          icon={<MdAdd className="h-4 w-4" />}
          text={t("projects.photo_add_btn")}
          onClick={() => (addOpen ? resetAddForm() : setAddOpen(true))}
        />
      </div>

      {/* ── Add form ── */}
      {addOpen && (
        <form onSubmit={handleAdd} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
          <StorageCoverField
            label={t("projects.photo_image_label")}
            folder="projects/gallery"
            onUpload={(key) => setNewImageKey(key)}
            onRemove={() => setNewImageKey(null)}
          />
          <input
            value={newCaption}
            onChange={(e) => setNewCaption(e.target.value)}
            placeholder={t("projects.photo_caption_placeholder")}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green placeholder:text-slate-400"
          />
          <div className="flex gap-2">
            <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={resetAddForm} className="flex-1" />
            <Button variant="primary" text={t("projects.photo_add_submit")} type="submit" loading={creating} disabled={!newImageKey} className="flex-1" />
          </div>
        </form>
      )}

      {/* ── Photo grid ── */}
      {photos.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t("projects.no_photos")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((p) =>
            editingId === p.id ? (
              <div key={p.id} className="col-span-2 flex flex-col gap-3 rounded-xl border border-green/20 bg-green/5 p-4 sm:col-span-3 md:col-span-4">
                <StorageCoverField
                  label={t("projects.photo_image_label")}
                  folder="projects/gallery"
                  currentUrl={editCurrentUrl}
                  onUpload={(key) => { setEditImageKey(key); setEditImageObj(null); }}
                  onRemove={() => setEditImageObj(null)}
                />
                <input
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  placeholder={t("projects.photo_caption_placeholder")}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green"
                />
                <div className="flex gap-2">
                  <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={cancelEdit} icon={<MdClose className="h-3.5 w-3.5" />} className="flex-1" />
                  <Button variant="primary" text={t("projects.photo_save_btn")} type="button" loading={saving} onClick={() => handleSave(p.id)} icon={<MdCheck className="h-3.5 w-3.5" />} className="flex-1" />
                </div>
              </div>
            ) : (
              <div key={p.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <div className="aspect-square w-full">
                  <StorageImage
                    fileKey={p.image}
                    alt={p.caption || ""}
                    className="h-full w-full object-cover"
                    fallback={<div className="flex h-full w-full items-center justify-center text-slate-300"><MdPhotoLibrary className="h-8 w-8" /></div>}
                  />
                </div>
                {p.caption && (
                  <p className="truncate px-2 py-1.5 text-xs text-slate-600">{p.caption}</p>
                )}
                <div className="absolute inset-x-0 top-0 flex items-center justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => startEdit(p)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 backdrop-blur-sm transition hover:bg-white"
                  >
                    <MdEdit className="h-3.5 w-3.5" />
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/90 text-white backdrop-blur-sm transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <MdDeleteOutline className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
