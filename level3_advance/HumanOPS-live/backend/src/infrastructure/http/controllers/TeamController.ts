import { Request, Response, NextFunction } from 'express';
import { CreateTeamUseCase } from '../../../application/use-cases/CreateTeamUseCase';
import { ListTeamsUseCase } from '../../../application/use-cases/ListTeamsUseCase';
import { AddTeamMemberUseCase } from '../../../application/use-cases/AddTeamMemberUseCase';
import { RemoveTeamMemberUseCase } from '../../../application/use-cases/RemoveTeamMemberUseCase';
import { TeamRepository } from '../../persistence/TeamRepository';
import { UserRepository } from '../../persistence/UserRepository';

const teamRepository = new TeamRepository();
const userRepository = new UserRepository();

export class TeamController {
  /**
   * POST /api/teams
   * Créer une nouvelle équipe
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createTeamUseCase = new CreateTeamUseCase(teamRepository);
      const team = await createTeamUseCase.execute(req.body);
      
      res.status(201).json({ team });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/teams
   * Lister les équipes
   */
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
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
   * POST /api/teams/:id/members
   * Ajouter un membre à une équipe
   */
  static async addMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const addTeamMemberUseCase = new AddTeamMemberUseCase(teamRepository, userRepository);
      const { id } = req.params;
      const { userId } = req.body;

      await addTeamMemberUseCase.execute(id, userId);
      res.status(200).json({ message: 'Member added successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/teams/:id/members/:userId
   * Retirer un membre d'une équipe
   */
  static async removeMember(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const removeTeamMemberUseCase = new RemoveTeamMemberUseCase(teamRepository);
      const { id, userId } = req.params;

      await removeTeamMemberUseCase.execute(id, userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
