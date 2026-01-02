import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UpdateHumanStateUseCase } from '../../../application/use-cases/UpdateHumanStateUseCase';
import { HumanStateRepository } from '../../persistence/HumanStateRepository';

const humanStateRepository = new HumanStateRepository();

export class HumanStateController {
  /**
   * @swagger
   * /human-states/me:
   *   put:
   *     summary: Update current user's human state
   *     tags: [HumanState]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               workload:
   *                 type: string
   *                 enum: [LOW, NORMAL, HIGH]
   *               availability:
   *                 type: string
   *                 enum: [AVAILABLE, MOBILISABLE, UNAVAILABLE]
   *     responses:
   *       200:
   *         description: State updated successfully
   *       401:
   *         description: Unauthorized
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
   * @swagger
   * /human-states/me:
   *   get:
   *     summary: Get current user's human state
   *     tags: [HumanState]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user state
   *       404:
   *         description: State not found
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
   * @swagger
   * /human-states/team/{teamId}:
   *   get:
   *     summary: Get human states for a specific team (Manager/Admin only)
   *     tags: [HumanState]
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
   *         description: List of team members states
   *       403:
   *         description: Insufficient permissions
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
