import { IAlertRepository } from '../../domain/repositories/IAlertRepository';
import { Alert } from '../../domain/entities/Alert';
import { Role } from '../../domain/value-objects/enums';

export class GetUserAlertsUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(userId: string, role: Role, unreadOnly?: boolean): Promise<Alert[]> {
    // 1. Récupérer les alertes spécifiques à l'utilisateur
    const userAlerts = await this.alertRepository.findByUserId(userId, unreadOnly);
    
    // 2. Récupérer les alertes destinées au rôle de l'utilisateur
    const roleAlerts = await this.alertRepository.findByRole(role, unreadOnly);
    
    // Fusionner et trier par date (desc)
    const allAlerts = [...userAlerts, ...roleAlerts].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return allAlerts;
  }
}
