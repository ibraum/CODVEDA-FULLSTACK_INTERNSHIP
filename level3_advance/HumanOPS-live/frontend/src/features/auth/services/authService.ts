import { apiClient } from "../../../lib/axios";
import { connectSocket, disconnectSocket } from "../../../lib/socket";

export interface User {
  id: string;
  email: string;
  role: "ADMIN" | "MANAGER" | "COLLABORATOR";
  password: string;
  teamId?: string;
  firstName?: string;
  lastName?: string;
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
