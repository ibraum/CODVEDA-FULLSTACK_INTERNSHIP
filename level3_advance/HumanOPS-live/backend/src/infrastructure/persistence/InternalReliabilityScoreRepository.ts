import { IInternalReliabilityScoreRepository } from '../../domain/repositories/IInternalReliabilityScoreRepository';
import { InternalReliabilityScore, CreateReliabilityScoreDTO } from '../../domain/entities/InternalReliabilityScore';
import { prisma } from './prisma';

export class InternalReliabilityScoreRepository implements IInternalReliabilityScoreRepository {
  async create(data: CreateReliabilityScoreDTO): Promise<InternalReliabilityScore> {
    return await prisma.internalReliabilityScore.create({
      data: {
        userId: data.userId,
        score: data.score,
        factors: data.factors,
      },
    }) as unknown as InternalReliabilityScore;
  }

  async findLatestByUserId(userId: string): Promise<InternalReliabilityScore | null> {
    return await prisma.internalReliabilityScore.findFirst({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
    }) as unknown as InternalReliabilityScore | null;
  }
}
