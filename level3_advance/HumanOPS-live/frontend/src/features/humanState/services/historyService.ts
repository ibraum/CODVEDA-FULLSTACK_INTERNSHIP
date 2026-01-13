import { apiClient } from "../../../lib/axios";

export interface HumanStateHistory {
  id: string;
  userId: string;
  workload: "LOW" | "NORMAL" | "HIGH";
  availability: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
  updatedAt: Date;
}

export const getMyHistory = async (
  limit: number = 20
): Promise<HumanStateHistory[]> => {
  const response = await apiClient.get<{ history: HumanStateHistory[] }>(
    `/human-states/history?limit=${limit}`
  );
  return response.data.history;
};
