import { Request, Response, NextFunction } from "express";
import { CreateTeamUseCase } from "../../../application/use-cases/CreateTeamUseCase.js";
import { ListTeamsUseCase } from "../../../application/use-cases/ListTeamsUseCase.js";
import { AddTeamMemberUseCase } from "../../../application/use-cases/AddTeamMemberUseCase.js";
import { RemoveTeamMemberUseCase } from "../../../application/use-cases/RemoveTeamMemberUseCase.js";
import { TeamRepository } from "../../persistence/TeamRepository.js";
import { UserRepository } from "../../persistence/UserRepository.js";

const teamRepository = new TeamRepository();
const userRepository = new UserRepository();

export class TeamController {
  /**
   * @swagger
   * /teams:
   *   post:
   *     summary: Create a new team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [name, managerId]
   *             properties:
   *               name:
   *                 type: string
   *               managerId:
   *                 type: string
   *     responses:
   *       201:
   *         description: Team created
   */
  static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const createTeamUseCase = new CreateTeamUseCase(teamRepository);
      const team = await createTeamUseCase.execute(req.body);

      res.status(201).json({ team });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /teams:
   *   get:
   *     summary: List teams
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: managerId
   *         schema:
   *           type: string
   *         description: Filter by manager ID
   *     responses:
   *       200:
   *         description: List of teams
   */
  static async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const listTeamsUseCase = new ListTeamsUseCase(teamRepository);
      const { managerId } = req.query;

      const teams = await listTeamsUseCase.execute(managerId as string);
      res.status(200).json({ teams });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /teams/{id}/members:
   *   post:
   *     summary: Add a member to a team
   *     tags: [Teams]
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
   *             required: [userId]
   *             properties:
   *               userId:
   *                 type: string
   *     responses:
   *       200:
   *         description: Member added
   */
  static async addMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const addTeamMemberUseCase = new AddTeamMemberUseCase(
        teamRepository,
        userRepository
      );
      const { id } = req.params;
      const { userId } = req.body;

      await addTeamMemberUseCase.execute(id, userId);
      res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /teams/{id}/members/{userId}:
   *   delete:
   *     summary: Remove a member from a team
   *     tags: [Teams]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Member removed
   */
  static async removeMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const removeTeamMemberUseCase = new RemoveTeamMemberUseCase(
        teamRepository
      );
      const { id, userId } = req.params;

      await removeTeamMemberUseCase.execute(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /teams/{id}/details:
   *   get:
   *     summary: Get team details including members and their states
   *     tags: [Teams]
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
   *         description: Team details
   */
  static async getDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { GetTeamDetailsUseCase } = await import(
        "../../../application/use-cases/GetTeamDetailsUseCase.js"
      );
      const getTeamDetailsUseCase = new GetTeamDetailsUseCase(teamRepository);
      const { id } = req.params;

      const team = await getTeamDetailsUseCase.execute(id);

      if (!team) {
        res.status(404).json({ error: "Team not found" });
        return;
      }

      res.status(200).json({ team });
    } catch (error) {
      next(error);
    }
  }
}
