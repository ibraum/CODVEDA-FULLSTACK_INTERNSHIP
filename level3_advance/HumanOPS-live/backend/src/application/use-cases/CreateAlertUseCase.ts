import { IAlertRepository } from '../../domain/repositories/IAlertRepository.js';
import { CreateAlertDTO, Alert } from '../../domain/entities/Alert.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { AlertCreatedEvent } from '../../domain/events/index.js';

export class CreateAlertUseCase {
  constructor(private alertRepository: IAlertRepository) {}

  async execute(data: CreateAlertDTO): Promise<Alert> {
    const alert = await this.alertRepository.create(data);

    // Publier l'événement pour la diffusion WebSocket
    const event: AlertCreatedEvent = {
      eventName: 'AlertCreated',
      occurredAt: new Date(),
      payload: {
        alertId: alert.id,
        type: alert.type,
        targetRole: alert.targetRole ? alert.targetRole : undefined,
        userId: alert.userId ? alert.userId : undefined,
      },
    };

    await eventBus.publish(event);

    return alert;
  }
}
