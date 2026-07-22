import { useMemo } from 'react';
import { useCachedData } from '@/display/hooks/useCachedData';
import { api } from '@/shared/api';
import type { MasjidEvent } from '@/shared/api';
import { useMosqueConfigStore } from '@/display/store/mosqueConfigStore';
import { useLanguageStore } from '@/display/store/languageStore';
import { getTranslations } from '@/display/store/languageStore';
import type { Translations } from '@/display/types/i18n';
import { toArabicNumerals } from '@/display/utils/helpers';

export interface UseEventsResult {
  events: Translations['events'];
  isLoading: boolean;
}

export function useEvents(currentTime: Date): UseEventsResult {
  const masjidId = useMosqueConfigStore((s) => s.masjidId);
  const language = useLanguageStore((s) => s.language);
  const translations = getTranslations(language);

  const { data, isLoading } = useCachedData<MasjidEvent[]>(
    `events-${masjidId ?? 'none'}`,
    () => api.listEvents(masjidId ?? ''),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const events = useMemo(() => {
    if (!data) return translations.events;
    const active = data.filter((e) => e.active);
    if (active.length === 0) return translations.events;

    return active.map((e) => ({
      badge: language === 'ar' ? 'حدث' : 'Event',
      title: language === 'ar' ? e.title_ar : e.title_en,
      speakerName: '',
      dateValue: language === 'ar' ? toArabicNumerals(e.date) : e.date,
      timeValue: language === 'ar' ? toArabicNumerals(e.time) : e.time,
      locationValue: '',
      cta: '',
    }));
  }, [data, language, translations.events]);

  return { events, isLoading };
}
