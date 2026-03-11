import { create } from 'zustand';

interface UserState {
  name: string;
  email: string;
  isLogged: boolean;
  setUser: (name: string, email: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  name: '',
  email: '',
  isLogged: false,
  setUser: (name, email) => set({ name, email, isLogged: true }),
  logout: () => set({ name: '', email: '', isLogged: false }),
}));