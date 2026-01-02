import { ITensionLevelRepository } from '../../domain/repositories/ITensionLevelRepository';
import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { IHumanStateRepository } from '../../domain/repositories/IHumanStateRepository';
import { IReinforcementRequestRepository } from '../../domain/repositories/IReinforcementRequestRepository';
import { TensionLevel } from '../../domain/value-objects/enums';
import { eventBus } from '../../infrastructure/event-bus/EventBus';
import { TeamTensionComputedEvent, CriticalTensionDetectedEvent } from '../../domain/events';

export class CalculateTensionUseCase {
  constructor(
    private tensionRepository: ITensionLevelRepository,
    private teamRepository: ITeamRepository,
    private stateRepository: IHumanStateRepository,
    private reinforcementRepository: IReinforcementRequestRepository
  ) {}

  async execute(teamId: string): Promise<void> {
    // 1. Récupérer les membres de l'équipe
    // (Note: stateRepository.findByTeamId récupère les états des membres directement)
    const states = await this.stateRepository.findByTeamId(teamId);
    
    if (states.length === 0) return; // Pas de membres ou pas d'états, rien à calculer

    // 2. Calculer les métriques
    // - % Surcharge (Workload HIGH)
    const overloadCount = states.filter(s => s.workload === 'HIGH').length;
    const overloadPercentage = (overloadCount / states.length) * 100;

    // - Requests Ratio (Demandes ouvertes vs Capacité réponse)
    // On simplifie : ratio = demandes expiées / total
    // Pour l'instant, utilisons un mock ou la donnée simple : demandes ouvertes
    const openRequests = await this.reinforcementRepository.findByTeamId(teamId); // Suppose méthode filtrant open... ou on filtre ici
    const activeRequests = openRequests.filter(r => r.status === 'OPEN').length;
    
    // Simplification du calcul pour l'exemple :
    const requestToAvailabilityRatio = activeRequests > 0 ? (activeRequests / states.length) : 0;

    // Metrics object
    const metrics = {
      overloadPercentage,
      averageDuration: 0, // Nécessiterait l'historique pour calculer la durée moyenne en High
      requestToAvailabilityRatio,
      refusalRate: 0, // Nécessiterait l'historique des réponses
    };

    // 3. Déterminer le niveau de tension
    let level = TensionLevel.LOW;

    if (overloadPercentage > 70 || requestToAvailabilityRatio > 0.8) {
      level = TensionLevel.CRITICAL;
    } else if (overloadPercentage > 50 || requestToAvailabilityRatio > 0.5) {
      level = TensionLevel.HIGH;
    } else if (overloadPercentage > 30 || requestToAvailabilityRatio > 0.3) {
      level = TensionLevel.MODERATE;
    }

    // 4. Sauvegarder le snapshot
    await this.tensionRepository.create({
      teamId,
      level,
      metrics,
    });

    // 5. Émettre événement
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
}
