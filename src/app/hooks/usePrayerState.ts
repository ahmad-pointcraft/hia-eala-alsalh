import { useMemo } from 'react';
import { Coordinates, PrayerTimes } from 'adhan';
import type { PrayerTime, NextPrayer } from '@/app/types/prayer';
import { getCurrentPrayer, getNextPrayer } from '@/app/utils/prayerTimes';
import { useMosqueConfigStore } from '@/app/store/mosqueConfigStore';
import { getCalculationParams, getMadhab, getHighLatitudeRule } from '@/app/utils/adhanMethodFactory';
import type { IqamaPrayerConfig } from '@/app/types/mosqueConfig';

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

function computeIqamaTime(
  adhanTime: string,
  config: IqamaPrayerConfig,
): string {
  if (config.mode === 'fixed') return config.value;

  const parts = adhanTime.split(':').map(Number);
  const totalMinutes = (parts[0] ?? 0) * 60 + (parts[1] ?? 0) + config.value;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function formatAdhanTime(date: Date | null, timeZone: string): string {
  if (!date) return '--:--';
  return date.toLocaleTimeString('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function usePrayerState(
  currentTime: Date,
  prayerNames: PrayerNames,
): PrayerStateResult {
  const config = useMosqueConfigStore((s) => s.config);

  const prayers = useMemo<PrayerTime[]>(() => {
    const coords = new Coordinates(config.latitude, config.longitude);
    const params = getCalculationParams(config.calculationMethod);
    params.madhab = getMadhab(config.madhab);
    params.highLatitudeRule = getHighLatitudeRule(config.highLatitudeRule);

    const prayerTimes = new PrayerTimes(coords, currentTime, params);

    const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

    return keys.map((key) => {
      const timeField = key.toLowerCase() as keyof PrayerTimes;
      const adhanTime = formatAdhanTime(
        prayerTimes[timeField] as Date | null,
        config.timeZone,
      );

      const iqamaTime =
        key === 'Sunrise'
          ? '\u2014'
          : computeIqamaTime(adhanTime, config.iqamaConfigs[key]);

      return {
        key,
        time: adhanTime,
        iqamaTime,
        name: prayerNames[key.toLowerCase()] ?? key,
      };
    });
  }, [
    currentTime,
    config.latitude,
    config.longitude,
    config.calculationMethod,
    config.madhab,
    config.highLatitudeRule,
    config.timeZone,
    config.iqamaConfigs,
    prayerNames,
  ]);

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
