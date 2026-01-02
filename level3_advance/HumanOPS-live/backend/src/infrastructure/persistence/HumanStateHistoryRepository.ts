import { IHumanStateHistoryRepository } from '../../domain/repositories/IHumanStateHistoryRepository';
import { HumanStateHistory, CreateHumanStateHistoryDTO } from '../../domain/entities/HumanStateHistory';
import { prisma } from './prisma';

export class HumanStateHistoryRepository implements IHumanStateHistoryRepository {
  async create(data: CreateHumanStateHistoryDTO): Promise<HumanStateHistory> {
    return await prisma.humanStateHistory.create({
      data: {
        userId: data.userId,
        workload: data.workload,
        availability: data.availability,
        // changedAt est auto-géré par @default(now()) dans le schema ou on laisse Prisma
      },
    }) as unknown as HumanStateHistory;
  }

  async findByUserId(userId: string, limit?: number): Promise<HumanStateHistory[]> {
    return await prisma.humanStateHistory.findMany({
      where: { userId },
      orderBy: { changedAt: 'desc' },
      take: limit,
    }) as unknown as HumanStateHistory[];
  }
}
