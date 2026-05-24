import { useMemo } from 'react';
import type { PrayerTime, NextPrayer } from '@/app/types/prayer';
import { DEFAULT_PRAYER_TIMES } from '@/app/data/prayers';
import { getCurrentPrayer, getNextPrayer } from '@/app/utils/prayerTimes';

interface PrayerNames {
  [key: string]: string;
}

interface PrayerStateResult {
  prayers: PrayerTime[];
  activePrayer: PrayerTime | null;
  nextPrayer: NextPrayer;
  isPraying: boolean;
  prayerPrayers: PrayerTime[];
  sunrisePrayer: PrayerTime | undefined;
  sunsetTime: string;
}

export function usePrayerState(
  currentTime: Date,
  prayerNames: PrayerNames,
): PrayerStateResult {
  const prayers = useMemo<PrayerTime[]>(() => {
    return DEFAULT_PRAYER_TIMES.map((p) => ({
      ...p,
      name: prayerNames[p.key.toLowerCase()] ?? p.key,
    }));
  }, [prayerNames]);

  const { activePrayer, nextPrayer, isPraying, prayerPrayers, sunrisePrayer, sunsetTime } =
    useMemo(() => {
      const activePrayer = getCurrentPrayer(prayers, currentTime);
      const nextPrayer = getNextPrayer(prayers, currentTime);

      const prayerPrayers = prayers.filter((p) => p.key !== 'Sunrise');
      const sunrisePrayer = prayers.find((p) => p.key === 'Sunrise');
      const sunsetTime = prayers.find((p) => p.key === 'Maghrib')?.time ?? '19:28';

      const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      const isPraying = prayerPrayers.some((p) => {
        if (p.iqamaTime === '\u2014') return false;
        const parts = p.iqamaTime.split(':').map(Number);
        const ih = parts[0] ?? 0;
        const im = parts[1] ?? 0;
        const iqamaMinutes = ih * 60 + im;
        return nowMinutes >= iqamaMinutes && nowMinutes < iqamaMinutes + 5;
      });

      return { activePrayer, nextPrayer, isPraying, prayerPrayers, sunrisePrayer, sunsetTime };
    }, [prayers, currentTime]);

  return { prayers, activePrayer, nextPrayer, isPraying, prayerPrayers, sunrisePrayer, sunsetTime };
}
