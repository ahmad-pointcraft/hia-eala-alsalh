import { useMemo } from 'react';
import { cacheStore } from '@/display/services/cache';
import type { HijriDateInfo } from '@/shared/types/mosqueConfig';

export interface UseIslamicHolidaysResult {
  holidays: string[];
  isHoliday: boolean;
}

export function useIslamicHolidays(hijriDate: HijriDateInfo, currentTime: Date): UseIslamicHolidaysResult {
  const result = useMemo(() => {
    const cacheKey = cacheStore.buildKey('aladhan', currentTime);

    const cached = cacheStore.get<{
      hijri: HijriDateInfo;
      holidays: string[];
      clockOffsetMs: number;
    }>(cacheKey);

    const holidays = cached?.holidays ?? [];
    return {
      holidays,
      isHoliday: holidays.length > 0,
    };
  }, [hijriDate, currentTime]);

  return result;
}
