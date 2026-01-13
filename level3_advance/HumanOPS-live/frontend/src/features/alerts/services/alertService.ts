import { apiClient } from "../../../lib/axios";

export interface Alert {
  id: string;
  userId: string;
  type:
    | "TENSION_HIGH"
    | "REINFORCEMENT_REQUEST"
    | "REINFORCEMENT_RESPONSE"
    | "TEAM_UPDATE"
    | "SYSTEM";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export const getMyAlerts = async (): Promise<Alert[]> => {
  const response = await apiClient.get<{ alerts: Alert[] }>("/alerts");
  return response.data.alerts;
};

export const markAlertAsRead = async (alertId: string): Promise<void> => {
  await apiClient.put(`/alerts/${alertId}/read`);
};
