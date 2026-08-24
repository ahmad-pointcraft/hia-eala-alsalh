import { create } from 'zustand';
import { api } from '@/shared/api';
import type { Session, SignUpInput } from '@/shared/api';
import { sessionSchema } from '@/shared/api/schema';
import { isExpired } from '@/shared/utils';

const STORAGE_KEY = 'hia-admin-session';

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = sessionSchema.parse(JSON.parse(raw));
    if (isExpired(session.expiresAt)) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}

interface SessionStore {
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSession = create<SessionStore>((set) => ({
  session: loadSession(),
  signIn: async (email, password) => {
    const session = await api.signIn(email, password);
    saveSession(session);
    set({ session });
  },
  signUp: async (input) => {
    const session = await api.signUp(input);
    saveSession(session);
    set({ session });
  },
  signOut: async () => {
    await api.signOut();
    clearSession();
    set({ session: null });
  },
}));
