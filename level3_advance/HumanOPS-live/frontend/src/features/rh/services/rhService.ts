import { apiClient } from "../../../lib/axios";

// Types
export interface UserWithHumanState {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  teamId?: string;
  isActive: boolean;
  humanState?: {
    workload: "LOW" | "NORMAL" | "HIGH";
    availability: "AVAILABLE" | "MOBILISABLE" | "UNAVAILABLE";
    updatedAt: string;
  };
}

export interface Skill {
  id: string;
  name: string;
  userCount?: number;
}

export interface TeamWithDetails {
  id: string;
  name: string;
  managerId: string;
  createdAt: string;
  memberCount?: number;
  currentTension?: {
    level: "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
  };
  pendingReinforcementRequests?: number;
}

export interface RHSetting {
  id: string;
  key: string;
  value: any;
  updatedBy?: string;
  updatedAt: string;
}

// User Management
export const getAllUsersWithStates = async (): Promise<
  UserWithHumanState[]
> => {
  try {
    const response = await apiClient.get<{ users: UserWithHumanState[] }>(
      "/users"
    );
    return response.data.users;
  } catch (error) {
    console.error("Failed to fetch users", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  data: {
    firstName?: string;
    lastName?: string;
    role?: string;
  }
): Promise<UserWithHumanState> => {
  const response = await apiClient.put<{ user: UserWithHumanState }>(
    `/users/${userId}`,
    data
  );
  return response.data.user;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await apiClient.delete(`/users/${userId}`);
};

// Skills Management
export const getAllSkillsWithCount = async (): Promise<Skill[]> => {
  const response = await apiClient.get<Skill[]>("/profiles/skills");
  return response.data;
};

export const createSkill = async (skillName: string): Promise<void> => {
  // For now, we'll use the add skill endpoint
  // In a real scenario, you might want a dedicated admin endpoint
  await apiClient.post("/profiles/me/skills", { skillName });
};

export const deleteSkill = async (skillId: string): Promise<void> => {
  // TODO: Implement delete skill endpoint in backend
  // For now, this is a placeholder
  await apiClient.delete(`/skills/${skillId}`);
};

// Teams Management
export const getAllTeamsWithDetails = async (): Promise<TeamWithDetails[]> => {
  try {
    const response = await apiClient.get<{ teams: TeamWithDetails[] }>(
      "/teams"
    );
    return response.data.teams;
  } catch (error) {
    console.error("Failed to fetch teams", error);
    throw error;
  }
};

export const createTeam = async (data: {
  name: string;
  managerId: string;
}): Promise<TeamWithDetails> => {
  const response = await apiClient.post<{ team: TeamWithDetails }>(
    "/teams",
    data
  );
  return response.data.team;
};

export const addTeamMember = async (
  teamId: string,
  userId: string
): Promise<void> => {
  await apiClient.post(`/teams/${teamId}/members`, { userId });
};

export const removeTeamMember = async (
  teamId: string,
  userId: string
): Promise<void> => {
  await apiClient.delete(`/teams/${teamId}/members/${userId}`);
};

// Settings Management
export const getRHSettings = async (): Promise<RHSetting[]> => {
  try {
    const response = await apiClient.get<{ settings: RHSetting[] }>(
      "/rh-settings"
    );
    return response.data.settings;
  } catch (error) {
    console.error("Failed to fetch RH settings", error);
    // Return default values if fetch fails or empty array
    return [];
  }
};

export const updateRHSetting = async (
  key: string,
  value: any
): Promise<RHSetting> => {
  const response = await apiClient.put<{ setting: RHSetting }>(
    `/rh-settings/${key}`,
    { value }
  );
  return response.data.setting;
};
