import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { UpdateProfileUseCase } from "../../../application/use-cases/UpdateProfileUseCase.js";
import { AddSkillUseCase } from "../../../application/use-cases/AddSkillUseCase.js";
import { GetProfileUseCase } from "../../../application/use-cases/GetProfileUseCase.js";
import { CollaboratorProfileRepository } from "../../persistence/CollaboratorProfileRepository.js";
import { SkillRepository } from "../../persistence/SkillRepository.js";

const profileRepository = new CollaboratorProfileRepository();
const skillRepository = new SkillRepository();

export class ProfileController {
  /**
   * @swagger
   * /profiles/me:
   *   get:
   *     summary: Get current user's profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile with skills
   */
  static async getMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
   * @swagger
   * /profiles/me:
   *   put:
   *     summary: Update profile preferences
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               preferences:
   *                 type: object
   *     responses:
   *       200:
   *         description: Profile updated
   */
  static async updateMe(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;

      const updateProfileUseCase = new UpdateProfileUseCase(profileRepository);
      const profile = await updateProfileUseCase.execute(
        req.user.userId,
        req.body
      );

      res.status(200).json({ profile });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /profiles/me/skills:
   *   post:
   *     summary: Add a skill to profile
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [skillName]
   *             properties:
   *               skillName:
   *                 type: string
   *     responses:
   *       200:
   *         description: Skill added
   */
  static async addSkill(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;

      const addSkillUseCase = new AddSkillUseCase(
        profileRepository,
        skillRepository
      );
      const { skillName } = req.body;

      await addSkillUseCase.execute(req.user.userId, skillName);
      res.status(200).json({ message: "Skill added" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /profiles/skills:
   *   get:
   *     summary: Get all available skills
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of all skills
   */
  static async getAllSkills(
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const skills = await skillRepository.findAll();
      res.status(200).json(skills);
    } catch (error) {
      next(error);
    }
  }
}
