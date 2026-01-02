import { Alert, CreateAlertDTO } from '../entities/Alert.js';
import { Role } from '../value-objects/enums.js';

export interface IAlertRepository {
  create(data: CreateAlertDTO): Promise<Alert>;
  findById(id: string): Promise<Alert | null>;
  findByUserId(userId: string, unreadOnly?: boolean): Promise<Alert[]>;
  findByRole(role: Role, unreadOnly?: boolean): Promise<Alert[]>;
  markAsRead(alertId: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}
