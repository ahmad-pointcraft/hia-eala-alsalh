import { useLanguageStore, getTranslations, getDirection } from './languageStore';

export * from './languageStore';
export * from './mosqueConfigStore';

export function useLanguage() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return {
    language,
    setLanguage,
    t: getTranslations(language),
    dir: getDirection(language),
  };
}

