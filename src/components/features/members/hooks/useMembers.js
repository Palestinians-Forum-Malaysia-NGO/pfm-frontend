import { useState, useEffect, useCallback } from "react";
import { memberService } from "../services/memberService";

export const useMembers = () => {
  const [members, setMembers]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const [deleteMember, setDeleteMember]   = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await memberService.getAll();
      setMembers(data);
    } catch (err) {
      setError(err.message ?? "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  const openDelete = (member) => setDeleteMember(member);
  const closeAll   = ()       => setDeleteMember(null);

  const handleDelete = async () => {
    if (!deleteMember) return;
    try {
      setActionLoading(true);
      await memberService.remove(deleteMember.id);
      setMembers((prev) => prev.filter((m) => m.id !== deleteMember.id));
      setDeleteMember(null);
    } catch (err) {
      setError(err.message ?? "Failed to delete member");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    members, loading, error, fetchMembers,
    deleteMember, actionLoading,
    openDelete, closeAll, handleDelete,
  };
};
