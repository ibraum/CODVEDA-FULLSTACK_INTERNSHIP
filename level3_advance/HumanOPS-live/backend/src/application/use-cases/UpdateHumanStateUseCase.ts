import { IHumanStateRepository } from '../../domain/repositories/IHumanStateRepository.js';
import { UpdateHumanStateDTO, HumanState } from '../../domain/entities/HumanState.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { HumanStateUpdatedEvent } from '../../domain/events/index.js';

export class UpdateHumanStateUseCase {
  constructor(private humanStateRepository: IHumanStateRepository) {}

  async execute(userId: string, data: UpdateHumanStateDTO): Promise<HumanState> {
    // Get current state
    const currentState = await this.humanStateRepository.findByUserId(userId);
    
    if (!currentState) {
      throw new Error('Human state not found for user');
    }

    // Update state
    const updatedState = await this.humanStateRepository.update(userId, data);

    // Emit event for event-driven architecture
    const event: HumanStateUpdatedEvent = {
      eventName: 'HumanStateUpdated',
      occurredAt: new Date(),
      payload: {
        userId,
        previousState: {
          workload: currentState.workload,
          availability: currentState.availability,
        },
        newState: {
          workload: updatedState.workload,
          availability: updatedState.availability,
        },
      },
    };

    await eventBus.publish(event);

    return updatedState;
  }
}
