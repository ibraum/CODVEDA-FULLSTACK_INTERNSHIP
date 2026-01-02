import { ReinforcementResponseModel, CreateReinforcementResponseDTO } from '../entities/ReinforcementResponse.js';

export interface IReinforcementResponseRepository {
  create(data: CreateReinforcementResponseDTO): Promise<ReinforcementResponseModel>;
  findByRequestId(requestId: string): Promise<ReinforcementResponseModel[]>;
  findByUserResponse(requestId: string, userId: string): Promise<ReinforcementResponseModel | null>;
}
