import { useCachedData } from './useCachedData';
import { hijriDayOfYear } from '@/display/utils';
import { fetchDailyHadith } from '@/display/services';
import { useMosqueConfigStore } from '@/display/store';
import type { HijriDateInfo } from '@/shared/types';
import type { HadithData } from '@/display/types';

export interface UseDailyHadithResult {
  hadith: HadithData | undefined;
  isLoading: boolean;
}

export function useDailyHadith(hijriDate: HijriDateInfo, currentTime: Date): UseDailyHadithResult {
  const timeZone = useMosqueConfigStore((s) => s.config.timeZone);
  const doy = hijriDayOfYear(hijriDate.month, hijriDate.day);

  const { data, isLoading } = useCachedData<HadithData>(
    'hadith',
    () => fetchDailyHadith(doy),
    24 * 60 * 60 * 1000,
    { dateScoped: true, timeZone, currentTime, fallback: undefined },
  );

  return { hadith: data, isLoading };
}
