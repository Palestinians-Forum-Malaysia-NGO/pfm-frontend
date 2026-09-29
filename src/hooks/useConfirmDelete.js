import React, { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import ConfirmModal from "components/ui/modals/ConfirmModal";

/**
 * Standard "are you sure?" step for delete actions, using the shared
 * ConfirmModal so every feature confirms deletes the same way.
 *
 *   const { askDelete, confirmDialog } = useConfirmDelete();
 *   <RowIconButton onClick={() => askDelete({ title, message, onConfirm: () => remove(id) })} />
 *   …
 *   {confirmDialog}
 *
 * onConfirm may be async — the dialog shows a spinner until it settles.
 */
export default function useConfirmDelete() {
  const [request, setRequest] = useState(null); // kept while closing so the text doesn't vanish mid-fade
  const [open, setOpen]       = useState(false);
  const [loading, setLoading] = useState(false);

  const askDelete = (req) => { setRequest(req); setOpen(true); };
  const close = () => { if (!loading) setOpen(false); };

  const confirm = async () => {
    setLoading(true);
    try {
      await request?.onConfirm?.();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const confirmDialog = (
    <ConfirmModal
      open={open}
      title={request?.title}
      message={request?.message}
      confirmText={request?.confirmText}
      icon={<MdDeleteOutline size={20} className="text-red-500" />}
      loading={loading}
      onClose={close}
      onConfirm={confirm}
    />
  );

  return { askDelete, confirmDialog };
}
