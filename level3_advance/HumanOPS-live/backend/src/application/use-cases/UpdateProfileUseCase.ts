import { ICollaboratorProfileRepository } from '../../domain/repositories/ICollaboratorProfileRepository';
import { CollaboratorProfile, UpdateProfileDTO } from '../../domain/entities/CollaboratorProfile';

export class UpdateProfileUseCase {
  constructor(private profileRepository: ICollaboratorProfileRepository) {}

  async execute(userId: string, data: UpdateProfileDTO): Promise<CollaboratorProfile> {
    return await this.profileRepository.update(userId, data);
  }
}
