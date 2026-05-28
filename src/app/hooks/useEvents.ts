import { useMemo } from 'react';
import { useCachedData } from '@/app/hooks/useCachedData';
import { fetchEvents } from '@/app/services/googleSheets';
import { useMosqueConfigStore } from '@/app/store/mosqueConfigStore';
import { useLanguageStore } from '@/app/store/languageStore';
import { getTranslations } from '@/app/store/languageStore';
import type { SheetEvent } from '@/app/types/googleSheets';
import type { Translations } from '@/app/types/i18n';
import { toArabicNumerals } from '@/app/utils/helpers';

export interface UseEventsResult {
  events: Translations['events'];
  isLoading: boolean;
}

export function useEvents(currentTime: Date): UseEventsResult {
  const config = useMosqueConfigStore((s) => s.config);
  const language = useLanguageStore((s) => s.language);
  const translations = getTranslations(language);

  const { data, isLoading } = useCachedData<SheetEvent[]>(
    'events',
    () => fetchEvents(config.googleSheetId, config.eventsGid),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  const events = useMemo(() => {
    if (!data) return translations.events;

    const active = data.filter((e) => e.active);
    if (active.length === 0) return translations.events;

    return active.map((e) => ({
      badge: language === 'ar' ? e.badge_ar : e.badge_en,
      title: language === 'ar' ? e.title_ar : e.title_en,
      speakerName: language === 'ar' ? e.speaker_ar : e.speaker_en,
      dateValue: language === 'ar' ? toArabicNumerals(e.date_ar || e.date) : (e.date_en || e.date || ''),
      timeValue: language === 'ar' ? toArabicNumerals(e.time_ar || e.time) : (e.time_en || e.time || ''),
      locationValue: language === 'ar' ? e.location_ar : e.location_en,
      cta: language === 'ar' ? e.cta_ar : e.cta_en,
      ...(e.image_url ? { imageUrl: e.image_url } : {}),
    }));
  }, [data, language, translations.events]);

  return { events, isLoading };
}
