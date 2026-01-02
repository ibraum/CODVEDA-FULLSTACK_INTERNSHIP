import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GetTeamTensionsUseCase } from '../../../application/use-cases/GetTeamTensionsUseCase';
import { CalculateTensionUseCase } from '../../../application/use-cases/CalculateTensionUseCase';
import { TensionLevelRepository } from '../../persistence/TensionLevelRepository';
import { TeamRepository } from '../../persistence/TeamRepository';
import { HumanStateRepository } from '../../persistence/HumanStateRepository';
import { ReinforcementRequestRepository } from '../../persistence/ReinforcementRequestRepository';
import { RHSettingRepository } from '../../persistence/RHSettingRepository';

const tensionRepository = new TensionLevelRepository();
const teamRepository = new TeamRepository();
const humanStateRepository = new HumanStateRepository();
const reinforcementRepository = new ReinforcementRequestRepository();
const settingRepository = new RHSettingRepository();

// Pour le calcul manuel (déclencheur)
const calculateTensionUseCase = new CalculateTensionUseCase(
  tensionRepository,
  teamRepository,
  humanStateRepository,
  reinforcementRepository,
  settingRepository
);

export class TensionController {
  /**
   * @swagger
   * /tensions/team/{teamId}:
   *   get:
   *     summary: Get team tension history
   *     tags: [Tension]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Tension history retrieved
   */
  static async getTeamHistory(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return; // Middleware Auth doit garantir user, mais sécurité TS

      // TODO: Vérifier que l'utilisateur a le droit de voir cette équipe
      // (Membre de l'équipe, Manager de l'équipe, ou Admin RH)
      
      const { teamId } = req.params;
      const { limit } = req.query;
      
      const getTensionsUseCase = new GetTeamTensionsUseCase(tensionRepository);
      const history = await getTensionsUseCase.execute(teamId, Number(limit) || 20);
      
      res.status(200).json({ history });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /tensions/team/{teamId}/calculate:
   *   post:
   *     summary: Force tension calculation
   *     tags: [Tension]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: teamId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Calculation triggered
   */
  static async calculateNow(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { teamId } = req.params;
      
      await calculateTensionUseCase.execute(teamId);
      
      res.status(200).json({ message: 'Tension calculation triggered successfully' });
    } catch (error) {
      next(error);
    }
  }
}
