export type PrayerKey = 'Fajr' | 'Sunrise' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTime {
  key: PrayerKey;
  name: string;
  time: string;
  iqamaTime: string;
}

export interface NextPrayer extends PrayerTime {
  isTomorrow: boolean;
}

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
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
  return { ...prayers[0], isTomorrow: true };
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
