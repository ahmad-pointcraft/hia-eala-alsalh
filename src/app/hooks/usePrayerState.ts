import { useMemo } from 'react';
import { Coordinates, PrayerTimes } from 'adhan';
import { DEFAULT_SUNSET_TIME } from '@/app/data/prayers';
import type { PrayerTime, NextPrayer } from '@/app/types/prayer';
import { getCurrentPrayer, getNextPrayer } from '@/app/utils/prayerTimes';
import { useMosqueConfigStore } from '@/app/store/mosqueConfigStore';
import { getCalculationParams, getMadhab, getHighLatitudeRule } from '@/app/utils/adhanMethodFactory';
import type { IqamaPrayerConfig } from '@/app/types/mosqueConfig';
import {
  AZAN_MAX_DURATION_SEC,
  STANDING_DURATION_SEC,
  PRAYER_WINDOW_SEC,
  SILENCE_DURATION_SEC,
} from '@/app/constants/prayerPhases';

// ACTIVE PHASE STATE PAYLOAD
interface ActivePhaseState {
  prayerName: string;
  prayerKey: string;
  timeRemainingSec: number;
  totalDurationSec: number;
}

// PRAYER WIDGET DISCRIMINATED UNION
export type PrayerWidgetState =
  | { phase: 'none' }
  | { phase: 'azan' } & ActivePhaseState
  | { phase: 'countdown' } & ActivePhaseState
  | { phase: 'standing' } & ActivePhaseState
  | { phase: 'silence' } & ActivePhaseState;

interface PrayerNames {
  [key: string]: string;
}

interface PrayerStateResult {
  prayers: PrayerTime[];
  activePrayer: PrayerTime | null;
  nextPrayer: NextPrayer;
  isPraying: boolean;
  prayingPrayer: PrayerTime | null;
  prayerPrayers: PrayerTime[];
  sunrisePrayer: PrayerTime | undefined;
  sunsetTime: string;
  widgetState: PrayerWidgetState;
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

  const { activePrayer, nextPrayer, isPraying, prayingPrayer, prayerPrayers, sunrisePrayer, sunsetTime, widgetState } =
    useMemo(() => {
      const activePrayer = getCurrentPrayer(prayers, currentTime);
      const nextPrayer = getNextPrayer(prayers, currentTime);

      const prayerPrayers = prayers.filter((p) => p.key !== 'Sunrise');
      const sunrisePrayer = prayers.find((p) => p.key === 'Sunrise');
      const sunsetTime = prayers.find((p) => p.key === 'Maghrib')?.time ?? DEFAULT_SUNSET_TIME;

      const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
      const prayingPrayer = prayerPrayers.find((p) => {
        if (p.iqamaTime === '\u2014') return false;
        const parts = p.iqamaTime.split(':').map(Number);
        const ih = parts[0] ?? 0;
        const im = parts[1] ?? 0;
        const iqamaMinutes = ih * 60 + im;
        return nowMinutes >= iqamaMinutes && nowMinutes < iqamaMinutes + 8;
      }) ?? null;
      const isPraying = !!prayingPrayer;

      // PARSE HH:MM TO SECONDS
      const parseTimeToSeconds = (timeStr: string): number => {
        const parts = timeStr.split(':').map(Number);
        return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60;
      };

      const nowSec =
        currentTime.getHours() * 3600 +
        currentTime.getMinutes() * 60 +
        currentTime.getSeconds();

      // CALCULATE WIDGET STATE
      let widgetState: PrayerWidgetState = { phase: 'none' };

      // LOOP ASSUMES CHRONOLOGICAL Fajr -> Isha ORDER
      for (const p of prayerPrayers) {
        if (p.iqamaTime === '\u2014') continue;

        const adhanSec = parseTimeToSeconds(p.time);
        const iqamaSec = parseTimeToSeconds(p.iqamaTime);
        const gapToIqama = iqamaSec - adhanSec;

        // PHASE 4: SILENCE
        if (nowSec >= iqamaSec + STANDING_DURATION_SEC && nowSec < iqamaSec + PRAYER_WINDOW_SEC) {
          widgetState = {
            phase: 'silence',
            prayerName: p.name,
            prayerKey: p.key,
            timeRemainingSec: iqamaSec + PRAYER_WINDOW_SEC - nowSec,
            totalDurationSec: SILENCE_DURATION_SEC,
          };
          break;
        }

        // PHASE 3: STANDING
        if (nowSec >= iqamaSec && nowSec < iqamaSec + STANDING_DURATION_SEC) {
          widgetState = {
            phase: 'standing',
            prayerName: p.name,
            prayerKey: p.key,
            timeRemainingSec: iqamaSec + STANDING_DURATION_SEC - nowSec,
            totalDurationSec: STANDING_DURATION_SEC,
          };
          break;
        }

        // PHASES 1 AND 2: ADHAN AND COUNTDOWN
        if (nowSec >= adhanSec && nowSec < iqamaSec) {
          const adhanDuration = Math.min(AZAN_MAX_DURATION_SEC, gapToIqama);

          if (gapToIqama <= AZAN_MAX_DURATION_SEC) {
            // ADHAN FILLS ENTIRE WINDOW
            widgetState = {
              phase: 'azan',
              prayerName: p.name,
              prayerKey: p.key,
              timeRemainingSec: iqamaSec - nowSec,
              totalDurationSec: gapToIqama,
            };
          } else if (nowSec < adhanSec + adhanDuration) {
            // ACTIVE ADHAN PHASE
            widgetState = {
              phase: 'azan',
              prayerName: p.name,
              prayerKey: p.key,
              timeRemainingSec: adhanSec + adhanDuration - nowSec,
              totalDurationSec: adhanDuration,
            };
          } else {
            // IQAMA COUNTDOWN PHASE
            widgetState = {
              phase: 'countdown',
              prayerName: p.name,
              prayerKey: p.key,
              timeRemainingSec: iqamaSec - nowSec,
              totalDurationSec: gapToIqama - adhanDuration,
            };
          }
          break;
        }
      }

      return { activePrayer, nextPrayer, isPraying, prayingPrayer, prayerPrayers, sunrisePrayer, sunsetTime, widgetState };
    }, [prayers, currentTime]);

  return { prayers, activePrayer, nextPrayer, isPraying, prayingPrayer, prayerPrayers, sunrisePrayer, sunsetTime, widgetState };
}
