import { useCachedData } from '@/app/hooks/useCachedData';
import { fetchDailyHadith } from '@/app/services/hadith';
import type { HijriDateInfo } from '@/app/types/mosqueConfig';
import type { HadithData } from '@/app/types/hadith';

export interface UseDailyHadithResult {
  hadith: HadithData | undefined;
  isLoading: boolean;
}

export function useDailyHadith(hijriDate: HijriDateInfo): UseDailyHadithResult {
  const hijriDayOfYear =
    (hijriDate.month - 1) * 30 -
    Math.floor((hijriDate.month - 1) / 2) +
    hijriDate.day;

  const { data, isLoading } = useCachedData<HadithData>(
    'hadith',
    () => fetchDailyHadith(hijriDayOfYear, new Date()),
    24 * 60 * 60 * 1000,
    { dateScoped: true, currentTime: new Date(), fallback: undefined },
  );

  return { hadith: data, isLoading };
}
