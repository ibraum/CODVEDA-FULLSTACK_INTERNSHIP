import type { User, ApiResponse } from '../types/User';

const URL = import.meta.env.VITE_API_URL
const API_BASE_URL = URL || 'http://localhost:3000';

export const apiService = {
  async getUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async createUser(user: Omit<User, 'id'>): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to create user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async updateUser(id: number, user: Partial<User>): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },

  async deleteUser(id: number): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete user');
    }
    const data: ApiResponse = await response.json();
    return data.data;
  },
};