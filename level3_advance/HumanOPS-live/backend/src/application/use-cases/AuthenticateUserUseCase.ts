import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserWithoutPassword } from '../../domain/entities/User.js';
import { config } from '../../config/index.js';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResult {
  user: UserWithoutPassword;
  token: string;
}

export class AuthenticateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: LoginDTO): Promise<LoginResult> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive || user.deletedAt) {
      throw new Error('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }
}
