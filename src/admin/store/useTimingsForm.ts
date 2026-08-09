import { create } from 'zustand';
import { DEFAULT_MOSQUE_CONFIG, type MosqueConfig, type IqamaPrayerConfig, type PrayerKey } from '@/shared/types';
import { api } from '@/shared/api';

// ==================== TYPES ====================

interface TimingsFormState {
  draft: MosqueConfig;
  dirty: boolean;
  saving: boolean;
  error: string | null;
  loading: boolean;

  init: (config: MosqueConfig) => void;
  setField: (patch: Partial<MosqueConfig>) => void;
  setIqama: (prayer: Exclude<PrayerKey, 'Sunrise'>, patch: Partial<IqamaPrayerConfig>) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  revert: (original: MosqueConfig) => void;
  reset: () => void;
  save: (masjidId: string, config: MosqueConfig) => Promise<boolean>;
}

// ==================== STORE ====================

export const useTimingsForm = create<TimingsFormState>((set) => ({
  draft: { ...DEFAULT_MOSQUE_CONFIG },
  dirty: false,
  saving: false,
  error: null,
  loading: false,

  init: (config) =>
    set({ draft: { ...config }, dirty: false, saving: false, error: null, loading: false }),

  setField: (patch) =>
    set((s) => ({ draft: { ...s.draft, ...patch }, dirty: true })),

  setIqama: (prayer, patch) =>
    set((s) => ({
      draft: {
        ...s.draft,
        iqamaConfigs: {
          ...s.draft.iqamaConfigs,
          [prayer]: { ...s.draft.iqamaConfigs[prayer], ...patch },
        },
      },
      dirty: true,
    })),

  setSaving: (saving) => set({ saving }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  revert: (original) => set({ draft: { ...original }, dirty: false, saving: false, error: null }),

  reset: () =>
    set({ draft: { ...DEFAULT_MOSQUE_CONFIG }, dirty: false, saving: false, error: null, loading: false }),

  save: async (masjidId, config) => {
    set({ saving: true, error: null });
    try {
      await api.updateMasjidConfig(masjidId, config);
      set({ dirty: false, saving: false });
      return true;
    } catch (e) {
      set({ saving: false, error: e instanceof Error ? e.message : 'Failed to save timings' });
      return false;
    }
  },
}));
