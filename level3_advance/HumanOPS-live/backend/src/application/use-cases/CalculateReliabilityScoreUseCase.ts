import { IInternalReliabilityScoreRepository } from '../../domain/repositories/IInternalReliabilityScoreRepository.js';
import { IReinforcementResponseRepository } from '../../domain/repositories/IReinforcementResponseRepository.js';
import { IHumanStateHistoryRepository } from '../../domain/repositories/IHumanStateHistoryRepository.js';

export class CalculateReliabilityScoreUseCase {
  constructor(
    private scoreRepository: IInternalReliabilityScoreRepository,
    private historyRepository: IHumanStateHistoryRepository,
    // @ts-ignore - Pour future implémentation de la réactivité
    private responseRepository: IReinforcementResponseRepository 
  ) {}

  async execute(userId: string): Promise<void> {
    // 1. Calculer les facteurs
    
    // a. Stabilité des états (Moins de changements erratiques = mieux)
    const history = await this.historyRepository.findByUserId(userId, 50); // Derniers 50 états
    let stabilityScore = 1.0;
    // Si trop de changements en peu de temps -> baisser score. (Logique simplifiée ici)
    if (history.length > 20) stabilityScore = 0.8; 
    
    // b. Réactivité (Réponse aux renforts) -> Nécessite plus de repo methods, on simule 0.8 pour MVP
    const responsivenessScore = 0.8;

    // c. Consistance (Cohérence déclaratif vs actions)
    const declarativeConsistencyScore = 0.9;

    // 2. Calculer le score global (Moyenne pondérée)
    // Formule PRD : entre 0.4 et 1.0
    const rawScore = (stabilityScore * 0.3) + (responsivenessScore * 0.3) + (declarativeConsistencyScore * 0.4);
    
    // Normaliser ou clamper si besoin, mais ici rawScore sera ~0.8-0.9
    let finalScore = Math.max(0.4, Math.min(1.0, rawScore));

    // 3. Sauvegarder
    await this.scoreRepository.create({
      userId,
      score: finalScore,
      factors: {
        stability: stabilityScore,
        responsiveness: responsivenessScore,
        declarativeConsistency: declarativeConsistencyScore
      }
    });
  }
}
