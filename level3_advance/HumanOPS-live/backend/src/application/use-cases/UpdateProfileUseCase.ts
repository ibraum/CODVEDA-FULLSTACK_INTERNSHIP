import { ICollaboratorProfileRepository } from '../../domain/repositories/ICollaboratorProfileRepository.js';
import { CollaboratorProfile, UpdateProfileDTO } from '../../domain/entities/CollaboratorProfile.js';

export class UpdateProfileUseCase {
  constructor(private profileRepository: ICollaboratorProfileRepository) {}

  async execute(userId: string, data: UpdateProfileDTO): Promise<CollaboratorProfile> {
    return await this.profileRepository.update(userId, data);
  }
}
