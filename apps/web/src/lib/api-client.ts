import type {
  UserResponse,
  CreateUser,
  UpdateUser,
  ProfileResponse,
  UpdateProfile,
} from '@assessment/schemas';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.local/api';

export const apiClient = {
  async getUsers(): Promise<UserResponse[]> {
    const response = await fetch(`${API_URL}/users`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },

  async getUser(id: string): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  async createUser(data: CreateUser): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  async updateUser(id: string, data: UpdateUser): Promise<UserResponse> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update user');
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
  },

  async getUserProfile(userId: string): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateUserProfile(userId: string, data: UpdateProfile): Promise<ProfileResponse> {
    const response = await fetch(`${API_URL}/users/${userId}/profile`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },
};
