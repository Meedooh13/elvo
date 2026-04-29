import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useCartStore } from './cart.store';

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

// BroadcastChannel syncs auth state across tabs instantly
const channel = typeof window !== 'undefined' ? new BroadcastChannel('elvo_auth') : null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,

      setAuth: (user, accessToken) => {
        set({ user, accessToken });
        useCartStore.getState().setUserId(user.id);
        channel?.postMessage({ type: 'LOGIN', user, accessToken });
      },

      setAccessToken: (accessToken) => set({ accessToken }),

      logout: () => {
        set({ user: null, accessToken: null });
        useCartStore.getState().setUserId(null);
        useCartStore.getState().clearCart();
        channel?.postMessage({ type: 'LOGOUT' });
      },
    }),
    {
      name: 'elvo-auth',
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken }),
    }
  )
);

// Listen for auth changes from other tabs
if (channel) {
  channel.onmessage = (event) => {
    const { type, user, accessToken } = event.data;
    if (type === 'LOGIN') {
      useAuthStore.setState({ user, accessToken });
      useCartStore.getState().setUserId(user.id);
    } else if (type === 'LOGOUT') {
      useAuthStore.setState({ user: null, accessToken: null });
      useCartStore.getState().setUserId(null);
      useCartStore.getState().clearCart();
    }
  };
}
