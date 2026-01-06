export interface Alert {
  id: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  payload: Record<string, any>;
  createdAt: string;
}
