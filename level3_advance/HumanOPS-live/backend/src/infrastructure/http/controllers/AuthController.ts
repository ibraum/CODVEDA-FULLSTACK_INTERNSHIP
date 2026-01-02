import { Request, Response, NextFunction } from 'express';
import { AuthenticateUserUseCase } from '../../../application/use-cases/AuthenticateUserUseCase';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase';
import { UserRepository } from '../../persistence/UserRepository';

const userRepository = new UserRepository();

export class AuthController {
  /**
   * POST /api/auth/register
   * Inscription d'un nouvel utilisateur
   */
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createUserUseCase = new CreateUserUseCase(userRepository);
      const user = await createUserUseCase.execute(req.body);
      
      res.status(201).json({ user });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Connexion utilisateur
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);
      const result = await authenticateUserUseCase.execute(req.body);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
