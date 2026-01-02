import { Request, Response, NextFunction } from 'express';
import { AuthenticateUserUseCase } from '../../../application/use-cases/AuthenticateUserUseCase.js';
import { CreateUserUseCase } from '../../../application/use-cases/CreateUserUseCase.js';
import { UserRepository } from '../../persistence/UserRepository.js';

const userRepository = new UserRepository();

export class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password, firstName, lastName]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 minLength: 8
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [MANAGER, COLLABORATOR, ADMIN_RH]
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error or Email already exists
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
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user and get token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [email, password]
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                     email:
   *                       type: string
   *                     role:
   *                       type: string
   *                 token:
   *                   type: string
   *       401:
   *         description: Invalid credentials
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
