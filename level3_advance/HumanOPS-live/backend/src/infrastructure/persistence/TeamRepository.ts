import { ITeamRepository } from '../../domain/repositories/ITeamRepository';
import { Team, CreateTeamDTO, UpdateTeamDTO } from '../../domain/entities/Team';
import { prisma } from './prisma';

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
}
