import { ReinforcementRequest, CreateReinforcementRequestDTO, UpdateReinforcementRequestDTO } from '../entities/ReinforcementRequest';

export interface IReinforcementRequestRepository {
  create(data: CreateReinforcementRequestDTO): Promise<ReinforcementRequest>;
  findById(id: string): Promise<ReinforcementRequest | null>;
  findByTeamId(teamId: string): Promise<ReinforcementRequest[]>;
  findOpenRequests(): Promise<ReinforcementRequest[]>;
  findExpiredRequests(): Promise<ReinforcementRequest[]>;
  update(id: string, data: UpdateReinforcementRequestDTO): Promise<ReinforcementRequest>;
}
