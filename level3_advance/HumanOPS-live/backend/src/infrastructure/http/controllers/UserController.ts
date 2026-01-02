import { Request, Response, NextFunction } from 'express';
import { ListUsersUseCase } from '../../../application/use-cases/ListUsersUseCase.js';
import { UpdateUserUseCase } from '../../../application/use-cases/UpdateUserUseCase.js';
import { SoftDeleteUserUseCase } from '../../../application/use-cases/SoftDeleteUserUseCase.js';
import { UserRepository } from '../../persistence/UserRepository.js';
import { Role } from '../../../domain/value-objects/enums.js';

const userRepository = new UserRepository();

export class UserController {
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: List users
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: role
   *         schema:
   *           type: string
   *           enum: [MANAGER, COLLABORATOR, ADMIN_RH]
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: List of users
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
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Update user details
   *     tags: [Users]
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
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [MANAGER, COLLABORATOR, ADMIN_RH]
   *     responses:
   *       200:
   *         description: User updated
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
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Soft delete a user
   *     tags: [Users]
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
   *         description: User deleted
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
