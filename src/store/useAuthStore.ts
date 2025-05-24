import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setAuth: (data: { accessToken: string; refreshToken: string; user: User }) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,

      // Used on successful login
      setAuth: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),

      // Used after refresh token API
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      logout: () =>
        set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: 'auth-storage', // localStorage key
    }
  )
);