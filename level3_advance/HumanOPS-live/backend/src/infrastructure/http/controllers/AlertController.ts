import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GetUserAlertsUseCase } from '../../../application/use-cases/GetUserAlertsUseCase';
import { MarkAlertAsReadUseCase } from '../../../application/use-cases/MarkAlertAsReadUseCase';
import { AlertRepository } from '../../persistence/AlertRepository';

const alertRepository = new AlertRepository();

export class AlertController {
  /**
   * GET /api/alerts
   * Récupérer mes alertes
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
   * PUT /api/alerts/:id/read
   * Marquer une alerte comme lue
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
