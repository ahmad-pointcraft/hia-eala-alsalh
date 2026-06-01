import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language, Translations } from '@/app/types/i18n';
import { translations } from '@/app/data/translations';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'ar',
      setLanguage: (lang: Language) => set({ language: lang }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === 'ar' ? 'en' : 'ar' })),
    }),
    {
      name: 'hia-language',
      merge: (persisted, current) => {
        if (
          typeof persisted === 'object' &&
          persisted !== null &&
          'language' in persisted &&
          (persisted.language === 'ar' || persisted.language === 'en')
        ) {
          return { ...current, language: persisted.language as Language };
        }
        return current;
      },
    },
  ),
);

export const getTranslations = (language: Language): Translations => translations[language];

export const getDirection = (language: Language): 'rtl' | 'ltr' =>
  language === 'ar' ? 'rtl' : 'ltr';
