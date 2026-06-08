import { useState, useEffect, useCallback } from "react";
import { userService } from "../services/userService";
import { extractError } from "components/features/auth/utils";

export const useUsers = () => {
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [deleteUser, setDeleteUser]       = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err) {
      setError(extractError(err, "Failed to load users."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openDelete  = (user) => setDeleteUser(user);
  const closeAll    = ()     => setDeleteUser(null);

  const handleDelete = async () => {
    if (!deleteUser) return;
    try {
      setActionLoading(true);
      await userService.remove(deleteUser.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id));
      setDeleteUser(null);
    } catch (err) {
      const msg = extractError(err, "Failed to delete user.");
      setError(msg);
      throw new Error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  return {
    users, loading, error, fetchUsers,
    deleteUser, actionLoading,
    openDelete, closeAll, handleDelete,
  };
};
