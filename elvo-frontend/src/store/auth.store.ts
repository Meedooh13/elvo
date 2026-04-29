import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  firstName: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  setAccessToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  accessToken: null,
  setAuth: (user, accessToken) => set({ user, accessToken }),
  setAccessToken: accessToken => set({ accessToken }),
  logout: () => set({ user: null, accessToken: null }),
}));
