import { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import { Alert, CreateAlertDTO } from '../../domain/entities/Alert';
import { Role } from '../../domain/value-objects/enums';
import { prisma } from './prisma';

export class AlertRepository implements IAlertRepository {
  async create(data: CreateAlertDTO): Promise<Alert> {
    return await prisma.alert.create({
      data: {
        type: data.type,
        targetRole: data.targetRole,
        userId: data.userId,
        payload: data.payload,
        isRead: false,
      },
    }) as Alert;
  }

  async findById(id: string): Promise<Alert | null> {
    return await prisma.alert.findUnique({
      where: { id },
    }) as Alert | null;
  }

  async findByUserId(userId: string, unreadOnly?: boolean): Promise<Alert[]> {
    return await prisma.alert.findMany({
      where: {
        userId,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
    }) as Alert[];
  }

  async findByRole(role: Role, unreadOnly?: boolean): Promise<Alert[]> {
    return await prisma.alert.findMany({
      where: {
        targetRole: role,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
    }) as Alert[];
  }

  async markAsRead(alertId: string): Promise<void> {
    await prisma.alert.update({
      where: { id: alertId },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }

  async markAllAsRead(userId: string): Promise<void> {
    // Marquer les alertes spécifiques à l'utilisateur
    await prisma.alert.updateMany({
      where: {
        userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
    
    // Note: Pour les alertes basées sur le rôle, c'est plus complexe car une alerte est partagée.
    // Dans ce modèle simple, marquer une alerte de rôle comme lue la marque pour tout le monde ?
    // Ou alors on devrait créer des "AlertRead" pour chaque user.
    // Pour l'instant, on se limite aux alertes utilisateur pour le "markAllAsRead".
  }
}
