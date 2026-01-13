import { useState, useEffect, useCallback } from "react";
import { apiClient } from "../lib/axios";
import { socket, connectSocket } from "../lib/socket";
import type { Alert } from "../types/alert";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ alerts: Alert[] }>("/alerts");
      setAlerts(response.data.alerts);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apiClient.put(`/alerts/${id}/read`);
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id
            ? { ...alert, isRead: true, readAt: new Date().toISOString() }
            : alert
        )
      );
    } catch (err) {
      console.error("Failed to mark alert as read", err);
    }
  };

  const markAllAsRead = async () => {
    const unreadAlerts = alerts.filter((a) => !a.isRead);

    // Optimistic update
    setAlerts((prev) =>
      prev.map((alert) => ({
        ...alert,
        isRead: true,
        readAt: new Date().toISOString(),
      }))
    );

    try {
      await Promise.all(
        unreadAlerts.map((a) => apiClient.put(`/alerts/${a.id}/read`))
      );
    } catch (err) {
      console.error("Failed to mark all as read", err);
      fetchAlerts();
    }
  };

  useEffect(() => {
    fetchAlerts();

    // Listen for real-time alerts
    const handleNewAlert = () => {
      fetchAlerts();
    };

    if (!socket.connected) {
      connectSocket();
    }

    socket.on("alert:new", handleNewAlert);

    const interval = setInterval(fetchAlerts, 60000); // Poll every minute as backup

    return () => {
      socket.off("alert:new", handleNewAlert);
      clearInterval(interval);
    };
  }, [fetchAlerts]);

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  return {
    alerts,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    unreadCount,
    refreshAlerts: fetchAlerts,
  };
};
