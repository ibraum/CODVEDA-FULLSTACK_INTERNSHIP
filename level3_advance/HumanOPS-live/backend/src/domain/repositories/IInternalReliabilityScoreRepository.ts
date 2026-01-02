import { InternalReliabilityScore, CreateReliabilityScoreDTO } from '../entities/InternalReliabilityScore';

export interface IInternalReliabilityScoreRepository {
  create(data: CreateReliabilityScoreDTO): Promise<InternalReliabilityScore>;
  findLatestByUserId(userId: string): Promise<InternalReliabilityScore | null>;
}
