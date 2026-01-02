import { HumanStateHistory, CreateHumanStateHistoryDTO } from '../entities/HumanStateHistory';

export interface IHumanStateHistoryRepository {
  create(data: CreateHumanStateHistoryDTO): Promise<HumanStateHistory>;
  findByUserId(userId: string, limit?: number): Promise<HumanStateHistory[]>;
}
