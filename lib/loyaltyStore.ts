import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { fabricateMember, PREVIEW_MEMBER, type Member, type PropertyType } from './loyalty';

export const LOYALTY_STORAGE_KEY = 'jontai.loyalty';

interface LoyaltyState {
  user: Member | null;
  isAuthenticated: boolean;
  signIn: (input: { email: string; name?: string; propertyType?: PropertyType }) => void;
  preview: () => void;
  signOut: () => void;
  updateProfile: (patch: { name: string; email: string }) => void;
}

// Mocked auth. No network, no password: the password field on /account/login is UI only.
export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      signIn: ({ email, name, propertyType }) =>
        set({ user: fabricateMember(email, name, propertyType), isAuthenticated: true }),
      preview: () => set({ user: { ...PREVIEW_MEMBER }, isAuthenticated: true }),
      signOut: () => {
        set({ user: null, isAuthenticated: false });
        useLoyaltyStore.persist.clearStorage();
      },
      updateProfile: ({ name, email }) => {
        const user = get().user;
        if (user) set({ user: { ...user, name: name.trim(), email: email.trim() } });
      },
    }),
    {
      name: LOYALTY_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
);
