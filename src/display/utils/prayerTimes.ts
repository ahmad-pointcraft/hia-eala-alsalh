import type { PrayerKey, PrayerSchedule, PrayerTime, NextPrayer } from '@/shared/types';

export type { PrayerKey, PrayerSchedule, PrayerTime, NextPrayer };

const parseTimeToMinutes = (time: string): number => {
  const parts = time.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  return hours * 60 + minutes;
};

/**
 * Wall-clock seconds since midnight for an instant, in the given IANA time zone.
 * Prayer time strings are formatted in the masjid time zone, so every comparison
 * against them must use wall-clock values from that same zone — never the
 * browser's local time.
 */
export const getWallClockSeconds = (date: Date, timeZone: string): number => {
  const parts = date.toLocaleTimeString('en-GB', { timeZone, hour12: false })
    .split(':')
    .map(Number);
  const hours = (parts[0] ?? 0) % 24;
  const minutes = parts[1] ?? 0;
  const seconds = parts[2] ?? 0;
  return hours * 3600 + minutes * 60 + seconds;
};

/** Calendar date ('YYYY-MM-DD') for an instant, in the given IANA time zone. */
export const getLocalDateKey = (date: Date, timeZone: string): string =>
  date.toLocaleDateString('en-CA', { timeZone });

export const getCurrentPrayer = (
  prayers: PrayerTime[],
  now: Date,
  timeZone: string,
): PrayerTime | null => {
  const currentMinutes = getWallClockSeconds(now, timeZone) / 60;
  let current: PrayerTime | null = null;
  for (const prayer of prayers) {
    if (parseTimeToMinutes(prayer.time) <= currentMinutes) {
      current = prayer;
    } else {
      break;
    }
  }
  return current;
};

export const getNextPrayer = (
  prayers: PrayerTime[],
  now: Date,
  timeZone: string,
): NextPrayer => {
  const currentMinutes = getWallClockSeconds(now, timeZone) / 60;
  for (const prayer of prayers) {
    if (parseTimeToMinutes(prayer.time) > currentMinutes) {
      return { ...prayer, isTomorrow: false };
    }
  }
  const firstPrayer = prayers[0];
  if (!firstPrayer) {
    throw new Error('Prayers list cannot be empty');
  }
  return { ...firstPrayer, isTomorrow: true };
};

export const getTimeToNextPrayer = (
  prayers: PrayerTime[],
  now: Date,
  timeZone: string,
): number => {
  const next = getNextPrayer(prayers, now, timeZone);
  const currentMinutes = getWallClockSeconds(now, timeZone) / 60;
  let targetMinutes = parseTimeToMinutes(next.time);
  if (next.isTomorrow) {
    targetMinutes += 24 * 60;
  }
  return Math.max(0, (targetMinutes - currentMinutes) * 60);
};
