import { apiClient } from "../../../lib/axios";
import { connectSocket, disconnectSocket } from "../../../lib/socket";

export interface User {
  id: string;
  email: string;
  role: "ADMIN_RH" | "MANAGER" | "COLLABORATOR";
  password?: string;
  teamId?: string;
  firstName?: string;
  lastName?: string;
}

export interface Profile {
  id: string;
  userId: string;
  preferences: {
    notifications: boolean;
    workingHours?: string;
    [key: string]: any;
  };
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface CreateUser {
  user: Partial<User>;
}

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    // Connect socket on successful login
    connectSocket();
  }

  return response.data;
};

export const register = async (data: Partial<User>): Promise<Partial<User>> => {
  const response = await apiClient.post<Partial<User>>("/auth/register", data);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  disconnectSocket();
  window.location.href = "/login";
};

export const getMe = async (): Promise<User> => {
  const response = await apiClient.get<User>("/auth/me"); // Assuming an endpoint exists or we rely on stored user
  return response.data;
};

export const updateMe = async (data: Partial<User>): Promise<User> => {
  const response = await apiClient.put<User>("/auth/me", data);
  return response.data;
};

export const getProfile = async (): Promise<Profile> => {
  const response = await apiClient.get<Profile>("/profiles/me");
  return response.data;
};

export const updateProfile = async (data: {
  preferences: any;
}): Promise<Profile> => {
  const response = await apiClient.put<{ profile: Profile }>(
    "/profiles/me",
    data
  );
  return response.data.profile;
};

export const addSkill = async (skillName: string): Promise<void> => {
  await apiClient.post("/profiles/me/skills", { skillName });
};

export const getAllSkills = async (): Promise<
  { id: string; name: string }[]
> => {
  const response = await apiClient.get<{ id: string; name: string }[]>(
    "/profiles/skills"
  );
  return response.data;
};

export const getAllUsers = async (): Promise<any[]> => {
  const response = await apiClient.get<any[]>("/users");
  return response.data;
};
