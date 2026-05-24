import type { PrayerKey, PrayerSchedule, PrayerTime, NextPrayer } from '@/app/types/prayer';

export type { PrayerKey, PrayerSchedule, PrayerTime, NextPrayer };

const parseTimeToMinutes = (time: string): number => {
  const parts = time.split(':').map(Number);
  const hours = parts[0] ?? 0;
  const minutes = parts[1] ?? 0;
  return hours * 60 + minutes;
};

export const getCurrentPrayer = (prayers: PrayerTime[], now: Date): PrayerTime | null => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
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

export const getNextPrayer = (prayers: PrayerTime[], now: Date): NextPrayer => {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
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

export const getTimeToNextPrayer = (prayers: PrayerTime[], now: Date): number => {
  const next = getNextPrayer(prayers, now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  let targetMinutes = parseTimeToMinutes(next.time);
  if (next.isTomorrow) {
    targetMinutes += 24 * 60;
  }
  return Math.max(0, (targetMinutes - currentMinutes) * 60);
};
