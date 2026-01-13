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

export interface HumanState {
  userId: string;
  workload: "LOW" | "NORMAL" | "HIGH";
  availability: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
  updatedAt: string;
}

export interface TeamMemberWithState extends TeamMember {
  humanState?: HumanState;
  joinedAt?: string;
}

export interface Manager {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export interface TensionSnapshot {
  id: string;
  teamId: string;
  level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  metrics: {
    overloadPercentage: number;
    averageDuration: number;
    requestToAvailabilityRatio: number;
    refusalRate: number;
  };
  calculatedAt: string;
}

export interface TeamDetails {
  team: Team;
  manager: Manager;
  members: TeamMemberWithState[];
  currentTension?: TensionSnapshot;
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
  changedAt: string;
}

export const getTeams = async (): Promise<Team[]> => {
  const response = await apiClient.get<{ teams: Team[] }>("/teams");
  return response.data.teams;
};

export const getTeamTensions = async (
  teamId: string,
  limit: number = 10
): Promise<TensionSnapshot[]> => {
  const response = await apiClient.get<{ history: TensionSnapshot[] }>(
    `/tensions/team/${teamId}?limit=${limit}`
  );
  return response.data.history;
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

// New function to get users (team members)
export const getUsers = async (): Promise<TeamMember[]> => {
  const response = await apiClient.get<{ users: TeamMember[] }>("/users");
  return response.data.users;
};

// New function to get human states
export const getHumanStates = async (): Promise<HumanState[]> => {
  const response = await apiClient.get<{ states: HumanState[] }>(
    "/human-states"
  );
  return response.data.states;
};

// New function to get manager details
export const getUser = async (userId: string): Promise<Manager> => {
  const response = await apiClient.get<{ user: Manager }>(`/users/${userId}`);
  return response.data.user;
};

export const getTeamDetails = async (teamId: string): Promise<TeamDetails> => {
  const response = await apiClient.get<{ team: any }>(
    `/teams/${teamId}/details`
  );
  // Map backend response to TeamDetails
  return {
    team: {
      id: response.data.team.id,
      name: response.data.team.name,
      managerId: response.data.team.managerId,
      createdAt: response.data.team.createdAt,
    },
    manager: response.data.team.manager ?? {
      id: response.data.team.managerId,
      firstName: null,
      lastName: null,
      email: "Inconnu",
    },
    members: response.data.team.members.map((m: any) => ({
      id: m.user.id,
      email: m.user.email,
      firstName: m.user.firstName,
      lastName: m.user.lastName,
      role: m.user.role,
      humanState: m.user.humanState, // Already object or null
      joinedAt: m.joinedAt,
    })),
  };
};
