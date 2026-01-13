import { useEffect } from "react";
import { useAuth } from "../features/auth/context/AuthContext";
import { socket } from "../lib/socket";

interface ReinforcementRequestEvent {
  requestId: string;
  teamId: string;
  teamName: string;
  urgencyLevel: number;
  requiredSkills: Record<string, any>;
}

interface TensionAlertEvent {
  teamId: string;
  teamName: string;
  tensionLevel: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  metrics: {
    overloadPercentage: number;
    averageDuration: number;
  };
}

export const useRealtimeNotifications = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Connect socket if not already connected
    if (!socket.connected) {
      socket.connect();
    }

    // Listen for new reinforcement requests (for all users)
    const handleNewReinforcementRequest = (data: ReinforcementRequestEvent) => {
      console.log("New reinforcement request:", data);

      // Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Nouvelle Demande de Renfort", {
          body: `L'équipe ${data.teamName} demande du renfort (Urgence: ${data.urgencyLevel}/10)`,
          icon: "/logo.png",
          tag: `reinforcement-${data.requestId}`,
        });
      }

      // You can also trigger a toast notification here
      // toast.info(`Nouvelle demande de renfort de ${data.teamName}`);
    };

    // Listen for tension alerts (for managers and admins)
    const handleTensionAlert = (data: TensionAlertEvent) => {
      console.log("Tension alert:", data);

      // Only show to managers and admins
      if (user.role === "MANAGER" || user.role === "ADMIN_RH") {
        const tensionLabels = {
          LOW: "Faible",
          MODERATE: "Modérée",
          HIGH: "Élevée",
          CRITICAL: "Critique",
        };

        const tensionLabel = tensionLabels[data.tensionLevel];
        const isUrgent =
          data.tensionLevel === "HIGH" || data.tensionLevel === "CRITICAL";

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification(
            isUrgent ? "⚠️ Alerte Tension Critique" : "Alerte Tension",
            {
              body: `L'équipe ${data.teamName} est en tension ${tensionLabel} (${data.metrics.overloadPercentage}% surchargés)`,
              icon: "/logo.png",
              tag: `tension-${data.teamId}`,
              requireInteraction: isUrgent,
            }
          );
        }

        // You can also trigger a toast notification here
        // if (isUrgent) {
        //   toast.error(`Tension critique dans ${data.teamName}`);
        // } else {
        //   toast.warning(`Tension élevée dans ${data.teamName}`);
        // }
      }
    };

    // Listen for human state updates (optional - for real-time dashboard updates)
    const handleHumanStateUpdate = (data: any) => {
      console.log("Human state updated:", data);
      // You can dispatch an event or update a global state here
      window.dispatchEvent(
        new CustomEvent("humanStateUpdate", { detail: data })
      );
    };

    // Register event listeners
    socket.on("reinforcement:new", handleNewReinforcementRequest);
    socket.on("tension:alert", handleTensionAlert);
    socket.on("humanState:updated", handleHumanStateUpdate);

    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      socket.off("reinforcement:new", handleNewReinforcementRequest);
      socket.off("tension:alert", handleTensionAlert);
      socket.off("humanState:updated", handleHumanStateUpdate);
    };
  }, [user]);

  return null;
};
