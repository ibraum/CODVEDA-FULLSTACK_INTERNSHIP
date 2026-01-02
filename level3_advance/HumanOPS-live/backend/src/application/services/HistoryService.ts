import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { IHumanStateHistoryRepository } from '../../domain/repositories/IHumanStateHistoryRepository.js';

export class HistoryService {
  constructor(private historyRepository: IHumanStateHistoryRepository) {
    this.setupListeners();
  }

  private setupListeners(): void {
    eventBus.on('HumanStateUpdated', async (event) => {
      const { userId, newState } = event.payload;
      
      try {
        await this.historyRepository.create({
          userId,
          workload: newState.workload,
          availability: newState.availability,
        });
        console.log(`[History] State archived for user ${userId}`);
      } catch (error) {
        console.error('[History] Failed to archive state:', error);
      }
    });
  }
}
