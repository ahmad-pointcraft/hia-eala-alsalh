import { useCachedData } from '@/app/hooks/useCachedData';
import { hijriDayOfYear } from '@/app/utils/hijri';
import { fetchDailyHadith } from '@/app/services/hadith';
import type { HijriDateInfo } from '@/app/types/mosqueConfig';
import type { HadithData } from '@/app/types/hadith';

export interface UseDailyHadithResult {
  hadith: HadithData | undefined;
  isLoading: boolean;
}

export function useDailyHadith(hijriDate: HijriDateInfo, currentTime: Date): UseDailyHadithResult {
  const doy = hijriDayOfYear(hijriDate.month, hijriDate.day);

  const { data, isLoading } = useCachedData<HadithData>(
    'hadith',
    () => fetchDailyHadith(doy),
    24 * 60 * 60 * 1000,
    { dateScoped: true, currentTime, fallback: undefined },
  );

  return { hadith: data, isLoading };
}
