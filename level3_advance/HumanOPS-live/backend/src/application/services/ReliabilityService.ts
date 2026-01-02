import { eventBus } from '../../infrastructure/event-bus/EventBus';
import { CalculateReliabilityScoreUseCase } from '../use-cases/CalculateReliabilityScoreUseCase';
import { IInternalReliabilityScoreRepository } from '../../domain/repositories/IInternalReliabilityScoreRepository';
import { IHumanStateHistoryRepository } from '../../domain/repositories/IHumanStateHistoryRepository';
import { IReinforcementResponseRepository } from '../../domain/repositories/IReinforcementResponseRepository';

export class ReliabilityService {
  private calculateUseCase: CalculateReliabilityScoreUseCase;

  constructor(
    scoreRepository: IInternalReliabilityScoreRepository,
    historyRepository: IHumanStateHistoryRepository,
    responseRepository: IReinforcementResponseRepository
  ) {
    this.calculateUseCase = new CalculateReliabilityScoreUseCase(
      scoreRepository,
      historyRepository,
      responseRepository
    );
    this.setupListeners();
  }

  private setupListeners(): void {
    // Recalculer le score à chaque changement d'état significatif
    eventBus.on('HumanStateUpdated', async (event) => {
      await this.triggerCalculation(event.payload.userId);
    });

    // Recalculer le score à chaque réponse à un renfort
    eventBus.on('ReinforcementAccepted', async (event) => {
      await this.triggerCalculation(event.payload.userId);
    });
    
    eventBus.on('ReinforcementRefused', async (event) => {
      await this.triggerCalculation(event.payload.userId);
    });
  }

  private async triggerCalculation(userId: string): Promise<void> {
    try {
      await this.calculateUseCase.execute(userId);
      // Silent success (internal metric)
    } catch (error) {
      console.error('[Reliability] Calculation failed:', error);
    }
  }
}
