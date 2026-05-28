import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  id: number | null;
  name: string;
  email: string;
  token: string;
  isLogged: boolean;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  setUser: (id: number, name: string, email: string, token: string) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      name: '',
      email: '',
      token: '',
      isLogged: false,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      setUser: (id, name, email, token) => set({ id, name, email, token, isLogged: true }),
      logout: () => set({ id: null, name: '', email: '', token: '', isLogged: false }),
    }),
    {
      name: 'mindeasy-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        email: state.email,
        token: state.token,
        isLogged: state.isLogged,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
