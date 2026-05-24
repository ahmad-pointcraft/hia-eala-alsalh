export const PRAYER_KEYS = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export type PrayerKey = (typeof PRAYER_KEYS)[number];

export interface PrayerSchedule {
  key: PrayerKey;
  time: string;
  iqamaTime: string;
}

export interface PrayerTime extends PrayerSchedule {
  name: string;
}

export interface NextPrayer extends PrayerTime {
  isTomorrow: boolean;
}
