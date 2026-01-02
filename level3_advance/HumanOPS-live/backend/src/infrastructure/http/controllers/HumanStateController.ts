import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UpdateHumanStateUseCase } from '../../../application/use-cases/UpdateHumanStateUseCase';
import { HumanStateRepository } from '../../persistence/HumanStateRepository';

const humanStateRepository = new HumanStateRepository();

export class HumanStateController {
  /**
   * PUT /api/human-states/me
   * Mise à jour de l'état humain du collaborateur connecté
   */
  static async updateMyState(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const updateHumanStateUseCase = new UpdateHumanStateUseCase(humanStateRepository);
      const state = await updateHumanStateUseCase.execute(req.user.userId, req.body);
      
      res.status(200).json({ state });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/human-states/me
   * Récupération de l'état humain du collaborateur connecté
   */
  static async getMyState(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const state = await humanStateRepository.findByUserId(req.user.userId);
      
      if (!state) {
        res.status(404).json({ error: 'Human state not found' });
        return;
      }
      
      res.status(200).json({ state });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/human-states/team/:teamId
   * Récupération des états humains d'une équipe (Manager/RH uniquement)
   */
  static async getTeamStates(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { teamId } = req.params;
      const states = await humanStateRepository.findByTeamId(teamId);
      
      res.status(200).json({ states });
    } catch (error) {
      next(error);
    }
  }
}
