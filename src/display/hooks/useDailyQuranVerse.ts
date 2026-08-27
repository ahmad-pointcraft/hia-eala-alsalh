import { useCachedData } from './useCachedData';
import { hijriDayOfYear } from '@/display/utils';
import { fetchDailyVerse } from '@/display/services';
import { useMosqueConfigStore } from '@/display/store';
import type { HijriDateInfo } from '@/shared/types';
import type { QuranVerse } from '@/display/types';

export interface UseDailyQuranVerseResult {
  verse: QuranVerse | undefined;
  isLoading: boolean;
}

export function useDailyQuranVerse(hijriDate: HijriDateInfo, currentTime: Date): UseDailyQuranVerseResult {
  const timeZone = useMosqueConfigStore((s) => s.config.timeZone);
  const doy = hijriDayOfYear(hijriDate.month, hijriDate.day);

  const { data, isLoading } = useCachedData<QuranVerse>(
    'quran',
    () => fetchDailyVerse(doy),
    24 * 60 * 60 * 1000,
    { dateScoped: true, timeZone, currentTime, fallback: undefined },
  );

  return { verse: data, isLoading };
}
