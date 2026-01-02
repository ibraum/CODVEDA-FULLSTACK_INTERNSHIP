import { IReinforcementResponseRepository } from '../../domain/repositories/IReinforcementResponseRepository.js';
import { IReinforcementRequestRepository } from '../../domain/repositories/IReinforcementRequestRepository.js';
import { ReinforcementResponseModel } from '../../domain/entities/ReinforcementResponse.js';
import { ReinforcementResponse, ReinforcementStatus } from '../../domain/value-objects/enums.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { ReinforcementAcceptedEvent, ReinforcementRefusedEvent } from '../../domain/events/index.js';

export class RespondToReinforcementUseCase {
  constructor(
    private responseRepository: IReinforcementResponseRepository,
    private requestRepository: IReinforcementRequestRepository
  ) {}

  async execute(requestId: string, userId: string, response: ReinforcementResponse): Promise<ReinforcementResponseModel> {
    const request = await this.requestRepository.findById(requestId);
    
    if (!request) {
      throw new Error('Reinforcement request not found');
    }

    if (request.status !== ReinforcementStatus.OPEN) {
      throw new Error('Reinforcement request is no longer open');
    }

    if (request.expiresAt < new Date()) {
      throw new Error('Reinforcement request has expired');
    }

    // Vérifier si déjà répondu
    const existingResponse = await this.responseRepository.findByUserResponse(requestId, userId);
    if (existingResponse) {
      throw new Error('User has already responded to this request');
    }

    const savedResponse = await this.responseRepository.create({
      requestId,
      userId,
      response,
    });

    // Émettre un événement
    if (response === ReinforcementResponse.ACCEPTED) {
      const event: ReinforcementAcceptedEvent = {
        eventName: 'ReinforcementAccepted',
        occurredAt: new Date(),
        payload: { requestId, userId },
      };
      await eventBus.publish(event);
    } else if (response === ReinforcementResponse.REFUSED) {
      const event: ReinforcementRefusedEvent = {
        eventName: 'ReinforcementRefused',
        occurredAt: new Date(),
        payload: { requestId, userId },
      };
      await eventBus.publish(event);
    }

    return savedResponse;
  }
}
