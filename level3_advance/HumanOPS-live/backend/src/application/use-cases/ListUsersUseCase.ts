import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UserWithoutPassword } from '../../domain/entities/User';
import { Role } from '../../domain/value-objects/enums';

export class ListUsersUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(filters?: { role?: Role; isActive?: boolean }): Promise<UserWithoutPassword[]> {
    // Conversion du role string en enum si nécessaire, géré par le controller ou ici
    // Le repository attend { role?: string; isActive?: boolean } compatible avec le filtre
    return await this.userRepository.findAll(filters);
  }
}
