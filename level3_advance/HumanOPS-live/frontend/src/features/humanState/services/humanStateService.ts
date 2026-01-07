import { apiClient } from "../../../lib/axios";

export interface HumanState {
  id: string;
  userId: string;
  workload: "LOW" | "NORMAL" | "HIGH";
  availability: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
  updatedAt: string;
}

export const getMyState = async (): Promise<HumanState> => {
  const response = await apiClient.get<{ state: HumanState }>(
    "/human-states/me"
  );
  return response.data.state;
};

export const updateMyState = async (data: {
  workload?: "LOW" | "NORMAL" | "HIGH";
  availability?: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
}): Promise<HumanState> => {
  const response = await apiClient.put<{ state: HumanState }>(
    "/human-states/me",
    data
  );
  return response.data.state;
};

export const getTeamStates = async (teamId: string): Promise<HumanState[]> => {
  const response = await apiClient.get<{ states: HumanState[] }>(
    `/human-states/team/${teamId}`
  );
  return response.data.states;
};
