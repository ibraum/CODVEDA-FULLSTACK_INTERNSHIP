import type { User, ApiResponse } from '../types/User';
import * as tokenUtils from '../utils/tokenUtils';

const URL = import.meta.env.VITE_API_URL
const API_BASE_URL = URL || 'http://localhost:3000';

const getAuthHeaders = () => {
  const token = tokenUtils.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

export const apiService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async updateUser(id: number, user: Partial<User>): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async deleteUser(id: number): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    return response.json();
  },

  async signup(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Signup failed');
    }

    return response.json();
  },
};