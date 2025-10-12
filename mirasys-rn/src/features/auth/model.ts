import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { secure } from '@/core/secure-storage';

type AuthState = {
  accessToken: string | null;
  username: string | null;
  _hydrated: boolean;
  setTokens: (t: { accessToken: string | null }) => void;
  setCreds: (c: { username: string; password?: string }) => void;
  logout: () => void;
  _setHydrated: (v: boolean) => void;
};

const storage = createJSONStorage<string>(() => ({
  getItem: async (name) => (await secure.get(name)) ?? null,
  setItem: async (name, value) => { await secure.set(name, value); },
  removeItem: async (name) => { await secure.del(name); },
}));

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      username: null,
      _hydrated: false,
      setTokens: ({ accessToken }) => set({ accessToken }),
      setCreds: ({ username }) => set({ username }),
      logout: () => set({ accessToken: null, username: null }),
      _setHydrated: (v) => set({ _hydrated: v }),
    }),
    {
      name: 'auth-store',
      storage,
      partialize: (s) => ({ accessToken: s.accessToken, username: s.username }),
      onRehydrateStorage: () => (state) => state?._setHydrated(true),
    },
  ),
);
