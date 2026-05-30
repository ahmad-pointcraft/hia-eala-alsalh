import { useCachedData } from '@/app/hooks/useCachedData';
import { hijriDayOfYear } from '@/app/utils/hijri';
import { fetchDailyVerse } from '@/app/services/quran';
import type { HijriDateInfo } from '@/app/types/mosqueConfig';
import type { QuranVerse } from '@/app/types/quran';

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
