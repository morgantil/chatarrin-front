import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  role: 'USER' | 'ADMIN';
  province: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('chatarrin_token', token);
    set({ user, token, isLoading: false });
  },

  clearAuth: () => {
    localStorage.removeItem('chatarrin_token');
    set({ user: null, token: null, isLoading: false });
  },

  initAuth: () => {
    const token = localStorage.getItem('chatarrin_token');
    if (!token) {
      set({ isLoading: false });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('chatarrin_token');
        set({ isLoading: false });
        return;
      }
      set({ token, isLoading: false });
    } catch {
      localStorage.removeItem('chatarrin_token');
      set({ isLoading: false });
    }
  },
}));
