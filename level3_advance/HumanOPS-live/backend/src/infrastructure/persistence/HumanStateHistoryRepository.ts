import { IHumanStateHistoryRepository } from '../../domain/repositories/IHumanStateHistoryRepository.js';
import { HumanStateHistory, CreateHumanStateHistoryDTO } from '../../domain/entities/HumanStateHistory.js';
import { prisma } from './prisma.js';

export class HumanStateHistoryRepository implements IHumanStateHistoryRepository {
  async create(data: CreateHumanStateHistoryDTO): Promise<HumanStateHistory> {
    const humanState = await prisma.humanState.findUnique({ where: { userId: data.userId } });
    if (!humanState) throw new Error(`HumanState not found for user ${data.userId}`);

    const result = await prisma.humanStateHistory.create({
      data: {
        userId: data.userId,
        humanStateId: humanState.id,
        previousState: {}, 
        newState: {
          workload: data.workload,
          availability: data.availability
        },
      },
    });

    const newState = result.newState as any;
    return {
      id: result.id,
      userId: result.userId,
      workload: newState?.workload || data.workload,
      availability: newState?.availability || data.availability,
      changedAt: result.changedAt,
    } as HumanStateHistory;
  }

  async findByUserId(userId: string, limit?: number): Promise<HumanStateHistory[]> {
    return await prisma.humanStateHistory.findMany({
      where: { userId },
      orderBy: { changedAt: 'desc' },
      take: limit,
    }) as unknown as HumanStateHistory[];
  }
}
