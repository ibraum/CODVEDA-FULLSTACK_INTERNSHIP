import { IUserRepository } from '../../domain/repositories/IUserRepository.js';

export class SoftDeleteUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.softDelete(userId);
  }
}
