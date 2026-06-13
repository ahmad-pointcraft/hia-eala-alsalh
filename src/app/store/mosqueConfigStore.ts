import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_MOSQUE_CONFIG,
  type MosqueConfig,
} from '@/app/types/mosqueConfig';

interface MosqueConfigStore {
  config: MosqueConfig;
  setConfig: (partial: Partial<MosqueConfig>) => void;
  resetConfig: () => void;
  // DEVELOPER CLOCK SPOOFING STATE
  mockClockOffsetMs: number;
  setMockClockOffsetMs: (offset: number) => void;
}

export const useMosqueConfigStore = create<MosqueConfigStore>()(
  persist(
    (set) => ({
      config: DEFAULT_MOSQUE_CONFIG,
      setConfig: (partial) =>
        set((state) => ({
          config: { ...state.config, ...partial },
        })),
      resetConfig: () => set({ config: DEFAULT_MOSQUE_CONFIG }),
      mockClockOffsetMs: 0,
      setMockClockOffsetMs: (offset) => set({ mockClockOffsetMs: offset }),
    }),
    {
      name: 'hia-mosque-config',
      // ONLY PERSIST THE PERMANENT CONFIG LAYER
      partialize: (state) => ({ config: state.config }),
    },
  ),
);
