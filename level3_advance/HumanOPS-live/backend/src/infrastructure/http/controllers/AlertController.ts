import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { GetUserAlertsUseCase } from '../../../application/use-cases/GetUserAlertsUseCase.js';
import { MarkAlertAsReadUseCase } from '../../../application/use-cases/MarkAlertAsReadUseCase.js';
import { AlertRepository } from '../../persistence/AlertRepository.js';

const alertRepository = new AlertRepository();

export class AlertController {
  /**
   * @swagger
   * /alerts:
   *   get:
   *     summary: Get current user's alerts
   *     tags: [Alerts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: unreadOnly
   *         schema:
   *           type: boolean
   *         description: Filter by unread status
   *     responses:
   *       200:
   *         description: List of alerts
   */
  static async getMyAlerts(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const getUserAlertsUseCase = new GetUserAlertsUseCase(alertRepository);
      const { unreadOnly } = req.query;
      
      const alerts = await getUserAlertsUseCase.execute(
        req.user.userId,
        req.user.role,
        unreadOnly === 'true'
      );
      
      res.status(200).json({ alerts });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /alerts/{id}/read:
   *   put:
   *     summary: Mark an alert as read
   *     tags: [Alerts]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Alert marked as read
   */
  static async markAsRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const markAlertAsReadUseCase = new MarkAlertAsReadUseCase(alertRepository);
      const { id } = req.params;
      
      await markAlertAsReadUseCase.execute(id, req.user.userId);
      res.status(200).json({ message: 'Alert marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
