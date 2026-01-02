import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateUserDTO, UserWithoutPassword } from '../../domain/entities/User';

export class UpdateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, data: UpdateUserDTO): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Si l'email est modifié, vérifier l'unicité
    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await this.userRepository.update(userId, data);

    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }
}
