import { ITensionLevelRepository } from '../../domain/repositories/ITensionLevelRepository.js';
// import { ITeamRepository } from '../../domain/repositories/ITeamRepository.js';
import { IHumanStateRepository } from '../../domain/repositories/IHumanStateRepository.js';
import { IReinforcementRequestRepository } from '../../domain/repositories/IReinforcementRequestRepository.js';
import { IRHSettingRepository } from '../../domain/repositories/IRHSettingRepository.js';
import { TensionLevel } from '../../domain/value-objects/enums.js';
import { eventBus } from '../../infrastructure/event-bus/EventBus.js';
import { TeamTensionComputedEvent, CriticalTensionDetectedEvent } from '../../domain/events/index.js';

export class CalculateTensionUseCase {
  constructor(
    private tensionRepository: ITensionLevelRepository,
    // private teamRepository: ITeamRepository, // Conservé pour future utilisation (ex: taille équipe)
    private stateRepository: IHumanStateRepository,
    private reinforcementRepository: IReinforcementRequestRepository,
    private settingRepository: IRHSettingRepository
  ) {}

  async execute(teamId: string): Promise<void> {
    // 1. Récupérer les membres de l'équipe
    const states = await this.stateRepository.findByTeamId(teamId);
    
    if (states.length === 0) return;

    // 2. Calculer les métriques
    // - % Surcharge (Workload HIGH)
    const overloadCount = states.filter(s => s.workload === 'HIGH').length;
    const overloadPercentage = (overloadCount / states.length) * 100;

    // - Requests Ratio
    const openRequests = await this.reinforcementRepository.findByTeamId(teamId);
    const activeRequests = openRequests.filter(r => r.status === 'OPEN').length;
    
    const requestToAvailabilityRatio = activeRequests > 0 ? (activeRequests / states.length) : 0;

    const metrics = {
      overloadPercentage,
      averageDuration: 0,
      requestToAvailabilityRatio,
      refusalRate: 0,
    };

    // 3. Récupérer les seuils configurés (ou valeurs par défaut)
    const thresholdCritical = await this.getSettingValue('TENSION_THRESHOLD_CRITICAL', 70);
    const thresholdHigh = await this.getSettingValue('TENSION_THRESHOLD_HIGH', 50);
    const thresholdModerate = await this.getSettingValue('TENSION_THRESHOLD_MODERATE', 30);

    const ratioCritical = await this.getSettingValue('RATIO_THRESHOLD_CRITICAL', 0.8);
    const ratioHigh = await this.getSettingValue('RATIO_THRESHOLD_HIGH', 0.5);
    const ratioModerate = await this.getSettingValue('RATIO_THRESHOLD_MODERATE', 0.3);

    // 4. Déterminer le niveau de tension
    let level = TensionLevel.LOW;

    if (overloadPercentage > thresholdCritical || requestToAvailabilityRatio > ratioCritical) {
      level = TensionLevel.CRITICAL;
    } else if (overloadPercentage > thresholdHigh || requestToAvailabilityRatio > ratioHigh) {
      level = TensionLevel.HIGH;
    } else if (overloadPercentage > thresholdModerate || requestToAvailabilityRatio > ratioModerate) {
      level = TensionLevel.MODERATE;
    }

    // 5. Sauvegarder le snapshot
    await this.tensionRepository.create({
      teamId,
      level,
      metrics,
    });

    // 6. Émettre événement
    const computedEvent: TeamTensionComputedEvent = {
        eventName: 'TeamTensionComputed',
        occurredAt: new Date(),
        payload: { teamId, level, metrics }
    };
    await eventBus.publish(computedEvent);

    if (level === TensionLevel.CRITICAL || level === TensionLevel.HIGH) {
      const criticalEvent: CriticalTensionDetectedEvent = {
        eventName: 'CriticalTensionDetected',
        occurredAt: new Date(),
        payload: { teamId, metrics }
      };
      await eventBus.publish(criticalEvent);
    }
  }

  private async getSettingValue(key: string, defaultValue: any): Promise<any> {
    const setting = await this.settingRepository.findByKey(key);
    return setting ? setting.value : defaultValue;
  }
}
