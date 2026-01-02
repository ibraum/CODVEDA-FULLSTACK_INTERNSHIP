import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CreateReinforcementRequestUseCase } from '../../../application/use-cases/CreateReinforcementRequestUseCase';
import { RespondToReinforcementUseCase } from '../../../application/use-cases/RespondToReinforcementUseCase';
import { ReinforcementRequestRepository } from '../../persistence/ReinforcementRequestRepository';
import { ReinforcementResponseRepository } from '../../persistence/ReinforcementResponseRepository';
import { config } from '../../../config';

const requestRepository = new ReinforcementRequestRepository();
const responseRepository = new ReinforcementResponseRepository();

export class ReinforcementController {
  /**
   * POST /api/reinforcements
   * Créer une demande de renfort (Manager uniquement)
   */
  static async create(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const createUseCase = new CreateReinforcementRequestUseCase(requestRepository);
      
      const { teamId, requiredSkills, urgencyLevel } = req.body;
      
      // Expiration par défaut : maintenant + X heures
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + (config.business.reinforcement.defaultExpirationHours || 24));

      const request = await createUseCase.execute({
        teamId,
        requiredSkills,
        urgencyLevel,
        expiresAt,
      });
      
      res.status(201).json({ request });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/reinforcements/:id/respond
   * Répondre à une demande (Collaborateur)
   */
  static async respond(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const respondUseCase = new RespondToReinforcementUseCase(responseRepository, requestRepository);
      const { id } = req.params;
      const { response } = req.body; // ACCEPTED, REFUSED

      const result = await respondUseCase.execute(id, req.user.userId, response);
      
      res.status(200).json({ response: result });
    } catch (error) {
      next(error);
    }
  }
}
