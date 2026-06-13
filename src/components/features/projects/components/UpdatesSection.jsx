import React, { useState } from "react";
import { MdCampaign, MdAdd, MdDeleteOutline, MdPerson } from "react-icons/md";
import FormHeader from "components/ui/form/FormHeader";
import Button from "components/ui/buttons/Button";
import RowIconButton from "components/ui/buttons/RowIconButton";
import { useCreateProjectUpdate, useDeleteProjectUpdate } from "components/features/projects/hooks";
import { useToast } from "components/ui/toast/ToastContext";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" }) : "—";

export default function UpdatesSection({ projectId, initialUpdates = [] }) {
  const [updates, setUpdates] = useState(initialUpdates);
  const [addOpen, setAddOpen] = useState(false);
  const [body,    setBody]    = useState("");

  const { execute: createUpdate, loading: creating } = useCreateProjectUpdate();
  const { execute: deleteUpdate, loading: deleting } = useDeleteProjectUpdate();
  const { success, error: toastError } = useToast();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    try {
      const created = await createUpdate(projectId, { body });
      setUpdates((prev) => [created, ...prev]);
      setBody("");
      setAddOpen(false);
      success("Update posted");
    } catch (err) {
      toastError("Failed to post update", err?.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUpdate(projectId, id);
      setUpdates((prev) => prev.filter((u) => u.id !== id));
      success("Update removed");
    } catch (err) {
      toastError("Failed to delete update", err?.message);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between mb-4">
        <FormHeader icon={<MdCampaign className="h-5 w-5" />} title="Project Updates" subtitle="Progress posts visible to community members" />
        <Button variant="ghost" icon={<MdAdd className="h-4 w-4" />} text="Post" onClick={() => setAddOpen((o) => !o)} />
      </div>

      {/* Post form */}
      {addOpen && (
        <form onSubmit={handleAdd} className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
          <textarea
            value={body} onChange={(e) => setBody(e.target.value)}
            placeholder="Write an update for this project…" rows={3} required
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-green focus:ring-1 focus:ring-green placeholder:text-slate-400"
          />
          <div className="flex gap-2">
            <Button variant="ghost" text="Cancel" type="button" onClick={() => { setAddOpen(false); setBody(""); }} className="flex-1" />
            <Button variant="primary" text="Post Update" type="submit" loading={creating} disabled={!body.trim()} className="flex-1" />
          </div>
        </form>
      )}

      {/* Updates list */}
      {updates.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">No updates posted yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-slate-100">
          {updates.map((u) => (
            <div key={u.id} className="flex items-start gap-3 py-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                <MdPerson className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {u.posted_by && <span className="text-xs font-semibold text-slate-700">{u.posted_by}</span>}
                  <span className="text-xs text-slate-400">{fmtDate(u.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{u.body}</p>
                {u.photo && (
                  <img src={u.photo} alt="Update" className="mt-2 max-h-48 rounded-lg object-cover border border-slate-100" />
                )}
              </div>
              <RowIconButton icon={<MdDeleteOutline className="h-3.5 w-3.5" />} title="Delete" onClick={() => handleDelete(u.id)} variant="danger" disabled={deleting} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
