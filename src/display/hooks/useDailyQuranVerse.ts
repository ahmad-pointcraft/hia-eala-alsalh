import { useCachedData } from '@/display/hooks/useCachedData';
import { hijriDayOfYear } from '@/display/utils/hijri';
import { fetchDailyVerse } from '@/display/services/quran';
import type { HijriDateInfo } from '@/display/types/mosqueConfig';
import type { QuranVerse } from '@/display/types/quran';

export interface UseDailyQuranVerseResult {
  verse: QuranVerse | undefined;
  isLoading: boolean;
}

export function useDailyQuranVerse(hijriDate: HijriDateInfo, currentTime: Date): UseDailyQuranVerseResult {
  const doy = hijriDayOfYear(hijriDate.month, hijriDate.day);

  const { data, isLoading } = useCachedData<QuranVerse>(
    'quran',
    () => fetchDailyVerse(doy),
    24 * 60 * 60 * 1000,
    { dateScoped: true, currentTime, fallback: undefined },
  );

  return { verse: data, isLoading };
}
