import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateUserDTO, UserWithoutPassword } from '../../domain/entities/User';

export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserWithoutPassword> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create user (password will be hashed in repository)
    const user = await this.userRepository.create(data);

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }
}
