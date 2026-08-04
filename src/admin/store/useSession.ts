import { create } from 'zustand';
import { api } from '@/shared/api';
import type { Session } from '@/shared/api';

const STORAGE_KEY = 'hia-admin-session';

function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
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
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useSession = create<SessionStore>((set) => ({
  session: loadSession(),
  signIn: async (email, password) => {
    const session = await api.signIn(email, password);
    saveSession(session);
    set({ session });
  },
  signUp: async (email, password) => {
    const session = await api.signUp(email, password);
    saveSession(session);
    set({ session });
  },
  signOut: async () => {
    await api.signOut();
    clearSession();
    set({ session: null });
  },
}));
