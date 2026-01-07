import { IHumanStateRepository } from "../../domain/repositories/IHumanStateRepository.js";
import {
  UpdateHumanStateDTO,
  HumanState,
} from "../../domain/entities/HumanState.js";
import { eventBus } from "../../infrastructure/event-bus/EventBus.js";
import { HumanStateUpdatedEvent } from "../../domain/events/index.js";
import { Workload, Availability } from "../../domain/value-objects/enums.js";

export class UpdateHumanStateUseCase {
  constructor(private humanStateRepository: IHumanStateRepository) {}

  async execute(
    userId: string,
    data: UpdateHumanStateDTO
  ): Promise<HumanState> {
    // Get current state
    const currentState = await this.humanStateRepository.findByUserId(userId);

    let updatedState: HumanState;

    if (!currentState) {
      // Create new state if it doesn't exist (Upsert)
      updatedState = await this.humanStateRepository.create({
        userId,
        workload: data.workload || Workload.NORMAL,
        availability: data.availability || Availability.AVAILABLE,
      });
    } else {
      // Update existing state
      updatedState = await this.humanStateRepository.update(userId, data);
    }

    // Emit event for event-driven architecture
    const event: HumanStateUpdatedEvent = {
      eventName: "HumanStateUpdated",
      occurredAt: new Date(),
      payload: {
        userId,
        previousState: {
          workload: currentState?.workload || "NONE",
          availability: currentState?.availability || "NONE",
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
