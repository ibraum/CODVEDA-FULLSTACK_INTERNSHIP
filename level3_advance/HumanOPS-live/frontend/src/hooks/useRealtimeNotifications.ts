import { useEffect } from "react";
import { useAuth } from "../features/auth/context/AuthContext";
import { socket, connectSocket } from "../lib/socket";
import { useToast } from "../context/ToastContext";

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
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Connect socket if not already connected
    connectSocket();

    // 1. Reinforcement Requests
    const handleNewReinforcementRequest = (data: ReinforcementRequestEvent) => {
      console.log("New reinforcement request:", data);

      // Trigger UI update
      window.dispatchEvent(
        new CustomEvent("reinforcementRequestUpdate", { detail: data })
      );

      // Toast Notification
      toast({
        title: "Nouvelle Demande de Renfort",
        description: `L'équipe ${data.teamName} demande du renfort (Urgence: ${data.urgencyLevel}/10)`,
        variant: "default",
      });

      // Browser Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Nouvelle Demande de Renfort", {
          body: `L'équipe ${data.teamName} demande du renfort (Urgence: ${data.urgencyLevel}/10)`,
          icon: "/logo.png",
          tag: `reinforcement-${data.requestId}`,
        });
      }
    };

    const handleReinforcementAccepted = (data: {
      requestId: string;
      userId: string;
    }) => {
      window.dispatchEvent(
        new CustomEvent("reinforcementRequestUpdate", { detail: data })
      );
      toast({
        title: "Renfort Accepté",
        description: "Un collaborateur a accepté la demande de renfort.",
        variant: "success",
      });
    };

    const handleReinforcementRefused = (data: {
      requestId: string;
      userId: string;
    }) => {
      window.dispatchEvent(
        new CustomEvent("reinforcementRequestUpdate", { detail: data })
      );
      // Optional: toast for refusal? Maybe not.
    };

    // 2. Tension Updates
    const handleTensionUpdated = (data: TensionAlertEvent) => {
      // Real-time gauge update
      window.dispatchEvent(new CustomEvent("tensionUpdate", { detail: data }));
    };

    const handleCriticalTension = (data: { teamId: string; metrics: any }) => {
      console.log("Critical tension:", data);
      window.dispatchEvent(
        new CustomEvent("tensionAlertUpdate", { detail: data })
      );

      if (user.role === "MANAGER" || user.role === "ADMIN_RH") {
        toast({
          title: "⚠️ Tension Critique",
          description: "Une équipe a atteint un niveau de tension critique.",
          variant: "destructive",
        });

        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("⚠️ Alerte Tension Critique", {
            body: `Une équipe nécessite une attention immédiate.`,
            icon: "/logo.png",
            tag: `tension-${data.teamId}`,
            requireInteraction: true,
          });
        }
      }
    };

    // 3. Human State Updates
    const handleHumanStateUpdated = (data: { userId: string; state: any }) => {
      console.log("Human state updated:", data);
      window.dispatchEvent(
        new CustomEvent("humanStateUpdate", { detail: data })
      );
    };

    // Register event listeners
    socket.on("reinforcement:new", handleNewReinforcementRequest);
    socket.on("reinforcement:accepted", handleReinforcementAccepted);
    socket.on("reinforcement:refused", handleReinforcementRefused);

    socket.on("tension:updated", handleTensionUpdated);
    socket.on("tension:critical", handleCriticalTension);

    socket.on("human_state:updated", handleHumanStateUpdated);
    socket.on("team_member_state:updated", handleHumanStateUpdated); // Listen to both

    // Request notification permission on mount
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      socket.off("reinforcement:new", handleNewReinforcementRequest);
      socket.off("reinforcement:accepted", handleReinforcementAccepted);
      socket.off("reinforcement:refused", handleReinforcementRefused);

      socket.off("tension:updated", handleTensionUpdated);
      socket.off("tension:critical", handleCriticalTension);

      socket.off("human_state:updated", handleHumanStateUpdated);
      socket.off("team_member_state:updated", handleHumanStateUpdated);
    };
  }, [user, toast]);

  return null;
};
