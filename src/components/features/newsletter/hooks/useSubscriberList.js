import { useState, useMemo } from "react";
import { useGetSubscribers } from "./useGetSubscribers";

export function useSubscriberList() {
  const { subscribers: all, loading, error, refetch } = useGetSubscribers();

  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const subscribers = useMemo(() => {
    let list = all;
    if (statusFilter !== "all") list = list.filter((s) => (statusFilter === "active" ? s.is_active : !s.is_active));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.email.toLowerCase().includes(q));
    }
    return list;
  }, [all, search, statusFilter]);

  const stats = useMemo(() => ({
    total:        all.length,
    active:       all.filter((s) => s.is_active).length,
    unsubscribed: all.filter((s) => !s.is_active).length,
  }), [all]);

  return {
    subscribers, loading, error, refetch, stats,
    search, setSearch,
    statusFilter, setStatusFilter,
  };
}
