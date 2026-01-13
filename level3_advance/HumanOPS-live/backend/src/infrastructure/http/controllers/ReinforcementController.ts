import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware.js";
import { CreateReinforcementRequestUseCase } from "../../../application/use-cases/CreateReinforcementRequestUseCase.js";
import { RespondToReinforcementUseCase } from "../../../application/use-cases/RespondToReinforcementUseCase.js";
import { GetOpenReinforcementRequestsUseCase } from "../../../application/use-cases/GetOpenReinforcementRequestsUseCase.js";
import { ReinforcementRequestRepository } from "../../persistence/ReinforcementRequestRepository.js";
import { ReinforcementResponseRepository } from "../../persistence/ReinforcementResponseRepository.js";
import { UserRepository } from "../../persistence/UserRepository.js";
import { AlertRepository } from "../../persistence/AlertRepository.js";
import { config } from "../../../config/index.js";

const requestRepository = new ReinforcementRequestRepository();
const responseRepository = new ReinforcementResponseRepository();
const userRepository = new UserRepository();
const alertRepository = new AlertRepository();

export class ReinforcementController {
  /**
   * @swagger
   * /reinforcements:
   *   post:
   *     summary: Create a reinforcement request (Manager only)
   *     tags: [Reinforcement]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [teamId, requiredSkills, urgencyLevel]
   *             properties:
   *               teamId:
   *                 type: string
   *               requiredSkills:
   *                 type: object
   *               urgencyLevel:
   *                 type: integer
   *     responses:
   *       201:
   *         description: Request created
   */
  static async create(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;

      const createUseCase = new CreateReinforcementRequestUseCase(
        requestRepository,
        userRepository,
        alertRepository
      );

      const { teamId, requiredSkills, urgencyLevel } = req.body;

      // Expiration par défaut : maintenant + X heures
      const expiresAt = new Date();
      expiresAt.setHours(
        expiresAt.getHours() +
          (config.business.reinforcement.defaultExpirationHours || 24)
      );

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
   * @swagger
   * /reinforcements/{id}/respond:
   *   post:
   *     summary: Respond to a reinforcement request
   *     tags: [Reinforcement]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [response]
   *             properties:
   *               response:
   *                 type: string
   *                 enum: [ACCEPTED, REFUSED]
   *     responses:
   *       200:
   *         description: Response recorded
   */
  static async respond(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;

      const respondUseCase = new RespondToReinforcementUseCase(
        responseRepository,
        requestRepository
      );
      const { id } = req.params;
      const { response } = req.body; // ACCEPTED, REFUSED

      const result = await respondUseCase.execute(
        id,
        req.user.userId,
        response
      );

      res.status(200).json({ response: result });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reinforcements:
   *   get:
   *     summary: List open available reinforcement requests
   *     tags: [Reinforcement]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: List of open requests
   */
  static async list(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;

      const getOpenRequestsUseCase = new GetOpenReinforcementRequestsUseCase(
        requestRepository
      );
      const requests = await getOpenRequestsUseCase.execute();

      res.status(200).json({ requests });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reinforcements/{id}:
   *   put:
   *     summary: Update a reinforcement request (Manager or Admin)
   *     tags: [Reinforcement]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               urgencyLevel:
   *                 type: integer
   *               requiredSkills:
   *                 type: object
   *               status:
   *                 type: string
   *     responses:
   *       200:
   *         description: Updated request
   */
  static async update(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;
      // TODO: Add ownership check if user is MANAGER. ADMIN_RH can update any.
      // For now assuming the route protection handles role check.

      const { id } = req.params;
      const { urgencyLevel, requiredSkills, status } = req.body;

      const { UpdateReinforcementRequestUseCase } = await import(
        "../../../application/use-cases/UpdateReinforcementRequestUseCase.js"
      );
      const updateUseCase = new UpdateReinforcementRequestUseCase(
        requestRepository
      );

      const updatedRequest = await updateUseCase.execute(id, {
        urgencyLevel,
        requiredSkills,
        status,
      });

      res.status(200).json({ request: updatedRequest });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /reinforcements/{id}:
   *   delete:
   *     summary: Delete a reinforcement request (Manager or Admin)
   *     tags: [Reinforcement]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Deleted
   */
  static async delete(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) return;
      // TODO: Add ownership check if user is MANAGER. ADMIN_RH can delete any.

      const { id } = req.params;

      const { DeleteReinforcementRequestUseCase } = await import(
        "../../../application/use-cases/DeleteReinforcementRequestUseCase.js"
      );
      const deleteUseCase = new DeleteReinforcementRequestUseCase(
        requestRepository
      );

      await deleteUseCase.execute(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
