import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_MOSQUE_CONFIG,
  type MosqueConfig,
} from '@/shared/types';

interface MosqueConfigStore {
  masjidId: string | null;
  config: MosqueConfig;
  setConfig: (partial: Partial<MosqueConfig>) => void;
  setMasjidId: (id: string | null) => void;
  resetConfig: () => void;
  mockClockOffsetMs: number;
  setMockClockOffsetMs: (offset: number) => void;
}

export const useMosqueConfigStore = create<MosqueConfigStore>()(
  persist(
    (set) => ({
      masjidId: null,
      config: DEFAULT_MOSQUE_CONFIG,
      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),
      setMasjidId: (id) => set({ masjidId: id }),
      resetConfig: () => set({ config: DEFAULT_MOSQUE_CONFIG }),
      mockClockOffsetMs: 0,
      setMockClockOffsetMs: (offset) => set({ mockClockOffsetMs: offset }),
    }),
    {
      name: 'hia-mosque-config',
      partialize: (state) => ({ config: state.config, masjidId: state.masjidId }),
    },
  ),
);
