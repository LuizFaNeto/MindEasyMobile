import { create } from 'zustand';

interface UserState {
  id: number | null;
  name: string;
  email: string;
  token: string;
  isLogged: boolean;
  setUser: (id: number, name: string, email: string, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  name: '',
  email: '',
  token: '',
  isLogged: false,
  setUser: (id, name, email, token) => set({ id, name, email, token, isLogged: true }),
  logout: () => set({ id: null, name: '', email: '', token: '', isLogged: false }),
}));