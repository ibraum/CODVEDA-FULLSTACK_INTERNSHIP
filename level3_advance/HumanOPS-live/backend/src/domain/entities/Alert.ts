import { Role } from '../value-objects/enums.js';

export interface Alert {
  id: string;
  type: string;
  targetRole: Role | null;
  userId: string | null;
  isRead: boolean;
  readAt: Date | null;
  payload: Record<string, any>;
  createdAt: Date;
}

export interface CreateAlertDTO {
  type: string;
  targetRole?: Role;
  userId?: string;
  payload: Record<string, any>;
}
