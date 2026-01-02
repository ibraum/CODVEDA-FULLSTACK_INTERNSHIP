import { CollaboratorProfile, CreateProfileDTO, UpdateProfileDTO } from '../entities/CollaboratorProfile.js';
import { Skill } from '../entities/Skill.js';

export interface ICollaboratorProfileRepository {
  create(data: CreateProfileDTO): Promise<CollaboratorProfile>;
  findByUserId(userId: string): Promise<CollaboratorProfile | null>;
  update(userId: string, data: UpdateProfileDTO): Promise<CollaboratorProfile>;
  addSkill(profileId: string, skillId: string): Promise<void>;
  removeSkill(profileId: string, skillId: string): Promise<void>;
  getSkills(profileId: string): Promise<Skill[]>;
}
