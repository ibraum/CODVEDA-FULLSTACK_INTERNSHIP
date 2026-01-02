import { IAlertRepository } from '../../domain/repositories/IAlertRepository';

export class MarkAlertAsReadUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(alertId: string, userId: string): Promise<void> {
    const alert = await this.alertRepository.findById(alertId);
    
    if (!alert) {
      throw new Error('Alert not found');
    }

    // Vérifier que l'utilisateur a le droit de marquer cette alerte
    // (soit c'est la sienne, soit elle a son rôle)
    // Ici on simplifie : si l'alerte a un userId, il faut que ce soit le bon.
    
    if (alert.userId && alert.userId !== userId) {
      throw new Error('Unauthorized access to alert');
    }

    await this.alertRepository.markAsRead(alertId);
  }
}
