import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import { UpdateProfileUseCase } from '../../../application/use-cases/UpdateProfileUseCase';
import { AddSkillUseCase } from '../../../application/use-cases/AddSkillUseCase';
import { GetProfileUseCase } from '../../../application/use-cases/GetProfileUseCase';
import { CollaboratorProfileRepository } from '../../persistence/CollaboratorProfileRepository';
import { SkillRepository } from '../../persistence/SkillRepository';

const profileRepository = new CollaboratorProfileRepository();
const skillRepository = new SkillRepository();

export class ProfileController {
  /**
   * GET /api/profiles/me
   * Récupérer son propre profil
   */
  static async getMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;
      
      const getProfileUseCase = new GetProfileUseCase(profileRepository);
      const data = await getProfileUseCase.execute(req.user.userId);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/profiles/me
   * Mettre à jour ses préférences
   */
  static async updateMe(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
      const profile = await updateProfileUseCase.execute(req.user.userId, req.body);
      
      res.status(200).json({ profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/profiles/me/skills
   * Ajouter une compétence
   */
  static async addSkill(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) return;

      const addSkillUseCase = new AddSkillUseCase(profileRepository, skillRepository);
      const { skillName } = req.body;
      
      await addSkillUseCase.execute(req.user.userId, skillName);
      res.status(200).json({ message: 'Skill added' });
    } catch (error) {
      next(error);
    }
  }
}
