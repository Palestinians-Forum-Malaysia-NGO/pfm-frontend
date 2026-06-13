import React from "react";
import { MdDeleteOutline, MdClose } from "react-icons/md";
import Button from "components/ui/buttons/Button";

export default function ProjectDeleteModal({ open, project, onClose, onConfirm, loading }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <MdClose className="h-4 w-4" />
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <MdDeleteOutline className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mb-1 text-lg font-bold text-slate-900">Delete Project</h3>
        <p className="mb-6 text-sm text-slate-500">
          Are you sure you want to delete <span className="font-semibold text-slate-700">"{project?.title}"</span>? This action cannot be undone. All milestones and updates will also be removed.
        </p>
        <div className="flex gap-3">
          <Button variant="ghost" text="Cancel" onClick={onClose} className="flex-1" />
          <Button variant="danger" text={loading ? "Deleting…" : "Delete Project"} loading={loading} onClick={onConfirm} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
