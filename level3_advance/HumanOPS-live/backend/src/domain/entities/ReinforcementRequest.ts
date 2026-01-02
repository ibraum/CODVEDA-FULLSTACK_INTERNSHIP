import { ReinforcementStatus } from '../value-objects/enums';

export interface ReinforcementRequest {
  id: string;
  teamId: string;
  requiredSkills: Record<string, any>;
  urgencyLevel: number;
  status: ReinforcementStatus;
  expiresAt: Date;
  createdAt: Date;
}

export interface CreateReinforcementRequestDTO {
  teamId: string;
  requiredSkills: Record<string, any>;
  urgencyLevel: number;
  expiresAt: Date;
}

export interface UpdateReinforcementRequestDTO {
  status?: ReinforcementStatus;
}
