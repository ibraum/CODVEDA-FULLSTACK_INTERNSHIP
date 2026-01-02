import { IHumanStateRepository } from '../../domain/repositories/IHumanStateRepository';
import { HumanState, CreateHumanStateDTO, UpdateHumanStateDTO } from '../../domain/entities/HumanState';
import { prisma } from './prisma';

export class HumanStateRepository implements IHumanStateRepository {
  async create(data: CreateHumanStateDTO): Promise<HumanState> {
    return await prisma.humanState.create({
      data,
    }) as HumanState;
  }

  async findByUserId(userId: string): Promise<HumanState | null> {
    return await prisma.humanState.findUnique({
      where: { userId },
    }) as HumanState | null;
  }

  async update(userId: string, data: UpdateHumanStateDTO): Promise<HumanState> {
    return await prisma.humanState.update({
      where: { userId },
      data,
    }) as HumanState;
  }

  async findByTeamId(teamId: string): Promise<HumanState[]> {
    const teamMembers = await prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          include: {
            humanState: true,
          },
        },
      },
    });

    return teamMembers
      .map(member => member.user.humanState)
      .filter(state => state !== null) as HumanState[];
  }
}
