import { apiClient } from "../../../lib/axios";

export interface Team {
  id: string;
  name: string;
  managerId: string;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
}

export interface TensionSnapshot {
  id: string;
  teamId: string;
  level: number;
  timestamp: string;
}

export interface ReinforcementRequest {
  id: string;
  teamId: string;
  requiredSkills: Record<string, any>;
  urgencyLevel: number;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface HumanStateHistory {
  id: string;
  userId: string;
  workload: string;
  availability: string;
  updatedAt: string;
}

export const getTeams = async (): Promise<Team[]> => {
  const response = await apiClient.get<{ teams: Team[] }>("/teams");
  return response.data.teams;
};

export const getTeamTensions = async (
  teamId: string,
  limit: number = 10
): Promise<TensionSnapshot[]> => {
  const response = await apiClient.get<{ tensions: TensionSnapshot[] }>(
    `/tensions/team/${teamId}?limit=${limit}`
  );
  return response.data.tensions;
};

export const getReinforcementRequests = async (): Promise<
  ReinforcementRequest[]
> => {
  const response = await apiClient.get<{ requests: ReinforcementRequest[] }>(
    "/reinforcements"
  );
  return response.data.requests;
};

export const getStateHistory = async (
  limit: number = 20
): Promise<HumanStateHistory[]> => {
  const response = await apiClient.get<{ history: HumanStateHistory[] }>(
    `/human-states/history?limit=${limit}`
  );
  return response.data.history;
};
