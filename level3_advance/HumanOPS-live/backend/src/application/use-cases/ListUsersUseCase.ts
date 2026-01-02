import { IUserRepository } from '../../domain/repositories/IUserRepository.js';
import { UserWithoutPassword } from '../../domain/entities/User.js';
import { Role } from '../../domain/value-objects/enums.js';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(filters?: { role?: Role; isActive?: boolean }): Promise<UserWithoutPassword[]> {
    // Conversion du role string en enum si nécessaire, géré par le controller ou ici
    // Le repository attend { role?: string; isActive?: boolean } compatible avec le filtre
    return await this.userRepository.findAll(filters);
  }
}
