// src/api/auth.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface LoginPayload {
  email: string;
  password: string;
}

interface Role {
  id: number;
  role: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  roles: Role[];
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, payload);
    return response.data.data; // accessing the `data` inside `data`
  } catch (error: any) {
    console.error('Login error:', error);
    throw error; // rethrow to be handled by the caller
  }
};

