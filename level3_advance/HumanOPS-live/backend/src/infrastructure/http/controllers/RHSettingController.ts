import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { GetRHSettingUseCase } from '../../../application/use-cases/GetRHSettingUseCase';
import { UpdateRHSettingUseCase } from '../../../application/use-cases/UpdateRHSettingUseCase';
import { RHSettingRepository } from '../../persistence/RHSettingRepository';

const settingRepository = new RHSettingRepository();

export class RHSettingController {
  /**
   * @swagger
   * /settings:
   *   get:
   *     summary: Get all RH settings
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of settings
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
   * @swagger
   * /settings/{key}:
   *   get:
   *     summary: Get a specific setting by key
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Setting value
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
   * @swagger
   * /settings/{key}:
   *   put:
   *     summary: Update a setting
   *     tags: [Settings]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [value]
   *             properties:
   *               value:
   *                 type: object
   *     responses:
   *       200:
   *         description: Setting updated
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
