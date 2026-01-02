import { ICollaboratorProfileRepository } from '../../domain/repositories/ICollaboratorProfileRepository.js';
import { CollaboratorProfile, CreateProfileDTO, UpdateProfileDTO } from '../../domain/entities/CollaboratorProfile.js';
import { Skill } from '../../domain/entities/Skill.js';
import { prisma } from './prisma.js';

export class CollaboratorProfileRepository implements ICollaboratorProfileRepository {
  async create(data: CreateProfileDTO): Promise<CollaboratorProfile> {
    return await prisma.collaboratorProfile.create({
      data,
    }) as CollaboratorProfile;
  }

  async findByUserId(userId: string): Promise<CollaboratorProfile | null> {
    return await prisma.collaboratorProfile.findUnique({
      where: { userId },
    }) as CollaboratorProfile | null;
  }

  async update(userId: string, data: UpdateProfileDTO): Promise<CollaboratorProfile> {
    // Upsert pour créer si n'existe pas lors de la mise à jour (cas où le profil n'a pas été créé à l'inscription)
    return await prisma.collaboratorProfile.upsert({
      where: { userId },
      update: data,
      create: {
        userId,
        preferences: data.preferences || {},
      },
    }) as CollaboratorProfile;
  }

  async addSkill(profileId: string, skillId: string): Promise<void> {
    await prisma.collaboratorSkill.create({
      data: {
        collaboratorId: profileId,
        skillId,
      },
    });
  }

  async removeSkill(profileId: string, skillId: string): Promise<void> {
    await prisma.collaboratorSkill.deleteMany({ // deleteMany car la clé primaire composée est compliquée à cibler directement avec delete simple parfois
      where: {
        collaboratorId: profileId,
        skillId,
      },
    });
  }

  async getSkills(profileId: string): Promise<Skill[]> {
    const skills = await prisma.collaboratorSkill.findMany({
      where: { collaboratorId: profileId },
      include: { skill: true },
    });
    
    return skills.map((s: any) => s.skill) as Skill[];
  }
}
