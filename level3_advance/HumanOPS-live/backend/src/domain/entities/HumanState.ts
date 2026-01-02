import { Workload, Availability } from '../value-objects/enums.js';

export interface HumanState {
  id: string;
  userId: string;
  workload: Workload;
  availability: Availability;
  updatedAt: Date;
}

export interface CreateHumanStateDTO {
  userId: string;
  workload: Workload;
  availability: Availability;
}

export interface UpdateHumanStateDTO {
  workload?: Workload;
  availability?: Availability;
}
