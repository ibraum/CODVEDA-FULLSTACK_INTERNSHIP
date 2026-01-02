import { ICollaboratorProfileRepository } from '../../domain/repositories/ICollaboratorProfileRepository.js';
import { CollaboratorProfile } from '../../domain/entities/CollaboratorProfile.js';
import { Skill } from '../../domain/entities/Skill.js';

export interface ProfileWithSkills {
  profile: CollaboratorProfile | null;
  skills: Skill[];
}

export class GetProfileUseCase {
  constructor(private profileRepository: ICollaboratorProfileRepository) {}

  async execute(userId: string): Promise<ProfileWithSkills> {
    const profile = await this.profileRepository.findByUserId(userId);
    let skills: Skill[] = [];

    if (profile) {
      skills = await this.profileRepository.getSkills(profile.id);
    }

    return { profile, skills };
  }
}
