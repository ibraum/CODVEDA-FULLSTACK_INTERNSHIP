import { IInternalReliabilityScoreRepository } from '../../domain/repositories/IInternalReliabilityScoreRepository.js';
import { InternalReliabilityScore, CreateReliabilityScoreDTO } from '../../domain/entities/InternalReliabilityScore.js';
import { prisma } from './prisma.js';

export class InternalReliabilityScoreRepository implements IInternalReliabilityScoreRepository {
  async create(data: CreateReliabilityScoreDTO): Promise<InternalReliabilityScore> {
    return await prisma.reliabilityScore.create({
      data: {
        userId: data.userId,
        score: data.score,
        // factors: data.factors, // Not in schema
      },
    }) as unknown as InternalReliabilityScore;
  }

  async findLatestByUserId(userId: string): Promise<InternalReliabilityScore | null> {
    return await prisma.reliabilityScore.findFirst({
      where: { userId },
      orderBy: { calculatedAt: 'desc' },
    }) as unknown as InternalReliabilityScore | null;
  }
}
