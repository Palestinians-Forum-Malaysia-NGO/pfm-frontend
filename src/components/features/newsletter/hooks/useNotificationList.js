import { useState, useMemo } from "react";
import { useGetNotifications } from "./useGetNotifications";

export function useNotificationList() {
  const { notifications: all, loading, error, refetch } = useGetNotifications();

  const [sourceFilter, setSourceFilter] = useState("all");

  const notifications = useMemo(() => {
    if (sourceFilter === "all") return all;
    return all.filter((n) => n.source === sourceFilter);
  }, [all, sourceFilter]);

  const stats = useMemo(() => ({
    total:    all.length,
    news:     all.filter((n) => n.source === "news").length,
    project:  all.filter((n) => n.source === "project").length,
    event:    all.filter((n) => n.source === "event").length,
  }), [all]);

  return {
    notifications, loading, error, refetch, stats,
    sourceFilter, setSourceFilter,
  };
}
