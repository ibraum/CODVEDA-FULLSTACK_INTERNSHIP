import { ITeamRepository } from '../../domain/repositories/ITeamRepository.js';
import { Team, CreateTeamDTO, UpdateTeamDTO } from '../../domain/entities/Team.js';
import { prisma } from './prisma.js';

export class TeamRepository implements ITeamRepository {
  async create(data: CreateTeamDTO): Promise<Team> {
    return await prisma.team.create({
      data,
    }) as Team;
  }

  async findById(id: string): Promise<Team | null> {
    return await prisma.team.findUnique({
      where: { id },
    }) as Team | null;
  }

  async findByManagerId(managerId: string): Promise<Team[]> {
    return await prisma.team.findMany({
      where: { managerId },
    }) as Team[];
  }

  async findAll(): Promise<Team[]> {
    return await prisma.team.findMany() as Team[];
  }

  async update(id: string, data: UpdateTeamDTO): Promise<Team> {
    return await prisma.team.update({
      where: { id },
      data,
    }) as Team;
  }

  async delete(id: string): Promise<void> {
    await prisma.team.delete({
      where: { id },
    });
  }

  async hasActiveMembers(teamId: string): Promise<boolean> {
    const count = await prisma.teamMember.count({
      where: {
        teamId,
        user: {
          isActive: true,
          deletedAt: null,
        },
      },
    });
    
    return count > 0;
  }

  async addMember(teamId: string, userId: string): Promise<void> {
    await prisma.teamMember.create({
      data: {
        teamId,
        userId,
      },
    });
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    // Vérifier d'abord que l'utilisateur appartient bien à cette équipe
    const membership = await prisma.teamMember.findUnique({
      where: { userId },
    });

    if (!membership || membership.teamId !== teamId) {
      throw new Error('User is not a member of this team');
    }

    await prisma.teamMember.delete({
      where: { userId },
    });
  }

  async updateMember(teamId: string, userId: string): Promise<void> {
    await prisma.teamMember.update({
      where: { userId },
      data: { teamId },
    });
  }
}
