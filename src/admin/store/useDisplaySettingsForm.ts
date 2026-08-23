import { create } from 'zustand';
import { DEFAULT_MOSQUE_CONFIG, type MosqueConfig } from '@/shared/types';
import { api } from '@/shared/api';

interface DisplaySettingsFormState {
  draft: MosqueConfig;
  dirty: boolean;
  saving: boolean;
  error: string | null;
  loading: boolean;

  init: (config: MosqueConfig) => void;
  setField: (patch: Partial<MosqueConfig>) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  revert: (original: MosqueConfig) => void;
  reset: () => void;
  save: (masjidId: string, config: MosqueConfig) => Promise<boolean>;
}

export const useDisplaySettingsForm = create<DisplaySettingsFormState>((set) => ({
  draft: { ...DEFAULT_MOSQUE_CONFIG },
  dirty: false,
  saving: false,
  error: null,
  loading: false,

  init: (config) =>
    set({ draft: { ...config }, dirty: false, saving: false, error: null, loading: false }),

  setField: (patch) =>
    set((s) => ({ draft: { ...s.draft, ...patch }, dirty: true })),

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
      set({ saving: false, error: e instanceof Error ? e.message : 'Failed to save display settings' });
      return false;
    }
  },
}));
