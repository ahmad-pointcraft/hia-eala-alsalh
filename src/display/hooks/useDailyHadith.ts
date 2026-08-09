import { useCachedData } from '@/display/hooks/useCachedData';
import { hijriDayOfYear } from '@/display/utils/hijri';
import { fetchDailyHadith } from '@/display/services/hadith';
import type { HijriDateInfo } from '@/shared/types';
import type { HadithData } from '@/display/types';

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
