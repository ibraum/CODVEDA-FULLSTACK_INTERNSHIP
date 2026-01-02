import { ReinforcementResponse } from '../value-objects/enums';

export interface ReinforcementResponseModel {
  id: string;
  requestId: string;
  userId: string;
  response: ReinforcementResponse;
  respondedAt: Date;
}

export interface CreateReinforcementResponseDTO {
  requestId: string;
  userId: string;
  response: ReinforcementResponse;
}
