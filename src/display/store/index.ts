import { useLanguageStore, getTranslations, getDirection } from './languageStore';

export { useLanguageStore } from './languageStore';
export { useMosqueConfigStore } from './mosqueConfigStore';

export function useLanguage() {
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);
  const toggleLanguage = useLanguageStore((s) => s.toggleLanguage);

  return {
    language,
    setLanguage,
    toggleLanguage,
    t: getTranslations(language),
    dir: getDirection(language),
  };
}
