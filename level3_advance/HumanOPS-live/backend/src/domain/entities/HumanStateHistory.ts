export interface HumanStateHistory {
  id: string;
  userId: string;
  workload: string;
  availability: string;
  changedAt: Date;
}

export interface CreateHumanStateHistoryDTO {
  userId: string;
  workload: string;
  availability: string;
}
