import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdCampaign, MdAdd, MdDeleteOutline, MdPerson, MdEdit, MdCheck, MdClose, MdImage,
} from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";
import RowIconButton from "components/ui/buttons/RowIconButton";
import { StorageCoverField } from "components/form";
import StorageImage from "components/ui/StorageImage";
import useStorageUrl from "components/features/storage/hooks/useStorageUrl";
import {
  useCreateProjectUpdate, useUpdateProjectUpdate, useDeleteProjectUpdate,
} from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";
import useAuth from "components/features/auth/hooks/useAuth";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function UpdatesSection({ projectId, initialUpdates = [] }) {
  const { t } = useTranslation();
  const [updates, setUpdates] = useState(initialUpdates);

  // Create state
  const [addOpen,       setAddOpen]       = useState(false);
  const [newBody,       setNewBody]       = useState("");
  const [newPhotoKey,   setNewPhotoKey]   = useState(null);

  // Edit state
  const [editingId,         setEditingId]         = useState(null);
  const [editBody,          setEditBody]          = useState("");
  const [editPhotoKey,      setEditPhotoKey]      = useState(null);
  const [editExistingKey,   setEditExistingKey]   = useState(null);
  const { url: editCurrentUrl } = useStorageUrl(editExistingKey);
  const [showPhotoInCreate, setShowPhotoInCreate] = useState(false);

  const { execute: createUpdate, loading: creating } = useCreateProjectUpdate();
  const { execute: patchUpdate,  loading: saving   } = useUpdateProjectUpdate();
  const { execute: deleteUpdate, loading: deleting } = useDeleteProjectUpdate();
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  /* ── Create ── */
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newBody.trim()) return;
    try {
      const payload = { body: newBody };
      if (newPhotoKey) payload.photo = newPhotoKey;
      const created = await createUpdate(projectId, payload);
      setUpdates((prev) => [created, ...prev]);
      setNewBody("");
      setNewPhotoKey(null);
      setShowPhotoInCreate(false);
      setAddOpen(false);
      success(t("projects.toast_update_posted"));
    } catch (err) {
      toastError(t("projects.toast_update_post_failed"), err?.message);
    }
  };

  /* ── Edit ── */
  const startEdit = (u) => {
    setEditingId(u.id);
    setEditBody(u.body);
    setEditPhotoKey(null);
    setEditExistingKey(u.photo || null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditBody("");
    setEditPhotoKey(null);
    setEditExistingKey(null);
  };

  const handleSave = async (updateId) => {
    if (!editBody.trim()) return;
    try {
      const payload = { body: editBody };
      if (editPhotoKey !== null) payload.photo = editPhotoKey || null;
      const updated = await patchUpdate(projectId, updateId, payload);
      setUpdates((prev) => prev.map((u) => (u.id === updateId ? updated : u)));
      cancelEdit();
      success(t("projects.toast_update_saved"));
    } catch (err) {
      toastError(t("projects.toast_update_save_failed"), err?.message);
    }
  };

  /* ── Delete ── */
  const handleDelete = async (id) => {
    try {
      await deleteUpdate(projectId, id);
      setUpdates((prev) => prev.filter((u) => u.id !== id));
      success(t("projects.toast_update_removed"));
    } catch (err) {
      toastError(t("projects.toast_update_remove_failed"), err?.message);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="mb-4 flex items-start justify-between">
        <FormHeader
          icon={<MdCampaign className="h-5 w-5" />}
          title={t("projects.updates_title")}
          subtitle={t("projects.updates_subtitle")}
        />
        <Button
          variant="ghost"
          icon={<MdAdd className="h-4 w-4" />}
          text={t("projects.update_post_btn")}
          onClick={() => { setAddOpen((o) => !o); setShowPhotoInCreate(false); setNewPhotoKey(null); setNewBody(""); }}
        />
      </div>

      {/* ── Create form ── */}
      {addOpen && (
        <form onSubmit={handleAdd} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
          <textarea
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            placeholder={t("projects.update_placeholder")}
            rows={3}
            required
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green placeholder:text-slate-400"
          />
          {showPhotoInCreate ? (
            <StorageCoverField
              label={t("projects.update_photo_label")}
              folder="projects/updates"
              onUpload={(key) => setNewPhotoKey(key)}
              onRemove={() => setNewPhotoKey(null)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowPhotoInCreate(true)}
              className="flex w-fit items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <MdImage className="h-3.5 w-3.5" /> {t("projects.update_attach_photo")}
            </button>
          )}
          <div className="flex gap-2">
            <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={() => { setAddOpen(false); setNewBody(""); setNewPhotoKey(null); setShowPhotoInCreate(false); }} className="flex-1" />
            <Button variant="primary" text={t("projects.update_add_submit")} type="submit" loading={creating} disabled={!newBody.trim()} className="flex-1" />
          </div>
        </form>
      )}

      {/* ── Updates list ── */}
      {updates.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">{t("projects.no_updates")}</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {updates.map((u) => (
            <div key={u.id} className="py-4">
              {editingId === u.id ? (
                /* ── Inline edit form ── */
                <div className="flex flex-col gap-3 rounded-xl border border-green/20 bg-green/5 p-4">
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green"
                  />
                  <StorageCoverField
                    label={t("projects.update_photo_label")}
                    folder="projects/updates"
                    currentUrl={editCurrentUrl}
                    onUpload={(key) => { setEditPhotoKey(key); setEditExistingKey(null); }}
                    onRemove={() => { setEditPhotoKey(""); setEditExistingKey(null); }}
                  />
                  <div className="flex gap-2">
                    <Button variant="ghost" text={t("projects.cancel")} type="button" onClick={cancelEdit} icon={<MdClose className="h-3.5 w-3.5" />} className="flex-1" />
                    <Button variant="primary" text={t("projects.update_save_btn")} type="button" loading={saving} disabled={!editBody.trim()} onClick={() => handleSave(u.id)} icon={<MdCheck className="h-3.5 w-3.5" />} className="flex-1" />
                  </div>
                </div>
              ) : (
                /* ── Normal row ── */
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                    <MdPerson className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      {u.posted_by && <span className="text-xs font-semibold text-slate-700">{u.posted_by}</span>}
                      <span className="text-xs text-slate-400">{fmtDate(u.created_at)}</span>
                    </div>
                    <p className="text-sm text-slate-700 whitespace-pre-wrap">{u.body}</p>
                    {u.photo && (
                      <StorageImage fileKey={u.photo} alt={t("projects.update_alt")} className="mt-2 max-h-48 w-full max-w-md rounded-lg object-cover border border-slate-100" />
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <RowIconButton icon={<MdEdit className="h-3.5 w-3.5" />}          title={t("projects.edit_project")}   onClick={() => startEdit(u)} />
                    {isAdmin && (
                      <RowIconButton icon={<MdDeleteOutline className="h-3.5 w-3.5" />} title={t("projects.delete_project")} onClick={() => handleDelete(u.id)} variant="danger" disabled={deleting} />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
