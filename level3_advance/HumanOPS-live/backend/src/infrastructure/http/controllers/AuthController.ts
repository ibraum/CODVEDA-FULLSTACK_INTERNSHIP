import { Request, Response, NextFunction } from "express";
import { AuthenticateUserUseCase } from "../../../application/use-cases/AuthenticateUserUseCase.js";
import { CreateUserUseCase } from "../../../application/use-cases/CreateUserUseCase.js";
import { UpdateUserUseCase } from "../../../application/use-cases/UpdateUserUseCase.js";
import { UserRepository } from "../../persistence/UserRepository.js";

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
  static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(`[AuthController] Registering user: ${req.body.email}`);
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
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      console.log(`[AuthController] Login attempt for: ${req.body.email}`);
      const authenticateUserUseCase = new AuthenticateUserUseCase(
        userRepository
      );
      const result = await authenticateUserUseCase.execute(req.body);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current authenticated user
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Current user details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 id:
   *                   type: string
   *                 email:
   *                   type: string
   *                 firstName:
   *                   type: string
   *                 lastName:
   *                   type: string
   *                 role:
   *                   type: string
   *       401:
   *         description: Not authenticated
   */
  static async getMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Cast request to any to access user property added by middleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const user = await userRepository.findById(userId);

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { passwordHash, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /auth/me:
   *   put:
   *     summary: Update current authenticated user details
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
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
   *               email:
   *                 type: string
   *                 format: email
   *     responses:
   *       200:
   *         description: User updated successfully
   *       400:
   *         description: Validation error
   *       401:
   *         description: Not authenticated
   */
  static async updateMe(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Cast request to any to access user property added by middleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { firstName, lastName, email, password } = req.body;
      const updateUserUseCase = new UpdateUserUseCase(userRepository);

      const updatedUser = await updateUserUseCase.execute(userId, {
        firstName,
        lastName,
        email,
        password,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
