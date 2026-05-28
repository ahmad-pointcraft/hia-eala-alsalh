import { useCachedData } from '@/app/hooks/useCachedData';
import { fetchDailyVerse } from '@/app/services/quran';
import type { HijriDateInfo } from '@/app/types/mosqueConfig';
import type { QuranVerse } from '@/app/types/quran';

export interface UseDailyQuranVerseResult {
  verse: QuranVerse | undefined;
  isLoading: boolean;
}

export function useDailyQuranVerse(hijriDate: HijriDateInfo): UseDailyQuranVerseResult {
  const hijriDayOfYear =
    (hijriDate.month - 1) * 30 -
    Math.floor((hijriDate.month - 1) / 2) +
    hijriDate.day;

  const { data, isLoading } = useCachedData<QuranVerse>(
    'quran',
    () => fetchDailyVerse(hijriDayOfYear, new Date()),
    24 * 60 * 60 * 1000,
    { dateScoped: true, currentTime: new Date(), fallback: undefined },
  );

  return { verse: data, isLoading };
}
