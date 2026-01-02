import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GetRHSettingUseCase } from '../../../application/use-cases/GetRHSettingUseCase';
import { UpdateRHSettingUseCase } from '../../../application/use-cases/UpdateRHSettingUseCase';
import { RHSettingRepository } from '../../persistence/RHSettingRepository';

const settingRepository = new RHSettingRepository();

export class RHSettingController {
  /**
   * GET /api/settings
   * Récupérer tous les paramètres
   */
  static async getAll(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const getUseCase = new GetRHSettingUseCase(settingRepository);
      const settings = await getUseCase.execute();
      
      res.status(200).json({ settings });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/settings/:key
   * Récupérer un paramètre spécifique
   */
  static async getByKey(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const getUseCase = new GetRHSettingUseCase(settingRepository);
      const { key } = req.params;
      
      // Force cast ou check car execute retourne Setting | Setting[]
      // Dans notre implémentation usecase, si key présent -> Setting simple
      const setting = await getUseCase.execute(key);
      
      res.status(200).json({ setting });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/settings/:key
   * Mettre à jour un paramètre
   */
  static async update(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const updateUseCase = new UpdateRHSettingUseCase(settingRepository);
      const { key } = req.params;
      const { value } = req.body;
      
      const setting = await updateUseCase.execute(key, value, req.user.userId);
      
      res.status(200).json({ setting });
    } catch (error) {
      next(error);
    }
  }
}
