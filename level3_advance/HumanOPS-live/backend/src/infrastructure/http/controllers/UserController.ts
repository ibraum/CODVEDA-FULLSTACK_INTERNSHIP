import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase';
import { SoftDeleteUserUseCase } from '../../../application/use-cases/SoftDeleteUserUseCase';
import { UserRepository } from '../../persistence/UserRepository';
import { Role } from '../../../domain/value-objects/enums';

const userRepository = new UserRepository();

export class UserController {
  /**
   * GET /api/users
   * Lister les utilisateurs (filtres optionnels)
   */
  static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const listUsersUseCase = new ListUsersUseCase(userRepository);
      const { role, isActive } = req.query;

      const filters = {
        role: role as Role,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      };

      const users = await listUsersUseCase.execute(filters);
      res.status(200).json({ users });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/users/:id
   * Mettre à jour un utilisateur
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateUserUseCase = new UpdateUserUseCase(userRepository);
      const { id } = req.params;
      
      const updatedUser = await updateUserUseCase.execute(id, req.body);
      res.status(200).json({ user: updatedUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Supprimer (soft delete) un utilisateur
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const softDeleteUserUseCase = new SoftDeleteUserUseCase(userRepository);
      const { id } = req.params;

      await softDeleteUserUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
