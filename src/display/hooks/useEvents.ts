import { useMemo } from 'react';
import { useCachedData } from './useCachedData';
import { api } from '@/shared/api';
import type { MasjidEvent } from '@/shared/api';
import { useMosqueConfigStore, useLanguageStore } from '@/display/store';
import type { EventSlide } from '@/display/types';
import { toArabicNumerals } from '@/display/utils';

export interface UseEventsResult {
  events: EventSlide[];
  isLoading: boolean;
}

export function useEvents(currentTime: Date): UseEventsResult {
  const masjidId = useMosqueConfigStore((s) => s.masjidId);
  const language = useLanguageStore((s) => s.language);

  const { data, isLoading } = useCachedData<MasjidEvent[]>(
    `events-${masjidId ?? 'none'}`,
    () => api.listEvents(masjidId ?? ''),
    5 * 60 * 1000,
    { currentTime, fallback: undefined },
  );

  // NO STATIC FALLBACK — zero active events means zero slides; the display
  // then shows the photo carousel (uploaded images → static mosque set).
  const events = useMemo<EventSlide[]>(() => {
    const active = (data ?? []).filter((e) => e.active);
    return active.map((e) => ({
      badge: (language === 'ar' ? e.badge_ar : e.badge_en) || undefined,
      title: language === 'ar' ? e.title_ar : e.title_en,
      speakerName: language === 'ar' ? e.speaker_ar : e.speaker_en,
      dateValue: language === 'ar' ? toArabicNumerals(e.date) : e.date,
      timeValue: language === 'ar' ? toArabicNumerals(e.time) : e.time,
      locationValue: language === 'ar' ? e.location_ar : e.location_en,
      cta: (language === 'ar' ? e.cta_ar : e.cta_en) || undefined,
      imageUrl: e.imageUrl ?? undefined,
    }));
  }, [data, language]);

  return { events, isLoading };
}
