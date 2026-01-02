import { IReinforcementRequestRepository } from '../../domain/repositories/IReinforcementRequestRepository.js';
import { CreateReinforcementRequestDTO, ReinforcementRequest } from '../../domain/entities/ReinforcementRequest.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { ReinforcementRequestedEvent } from '../../domain/events/index.js';

export class CreateReinforcementRequestUseCase {
  constructor(private reinforcementRepository: IReinforcementRequestRepository) {}

  async execute(data: CreateReinforcementRequestDTO): Promise<ReinforcementRequest> {
    const request = await this.reinforcementRepository.create(data);

    // Émettre l'événement pour notifier les collaborateurs éligibles
    const event: ReinforcementRequestedEvent = {
      eventName: 'ReinforcementRequested',
      occurredAt: new Date(),
      payload: {
        requestId: request.id,
        teamId: request.teamId,
        requiredSkills: request.requiredSkills,
        urgencyLevel: request.urgencyLevel,
      },
    };

    await eventBus.publish(event);

    return request;
  }
}
