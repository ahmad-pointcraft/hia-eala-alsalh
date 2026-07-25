// OFFLINE FALLBACK: used by usePrayerState when adhan library calculation is unavailable. Safe to keep — consumed as DEFAULT_PRAYER_TIMES fallback.
import type { PrayerSchedule } from '@/shared/types/prayer';

export const DEFAULT_SUNSET_TIME = '19:28';

export const DEFAULT_PRAYER_TIMES: PrayerSchedule[] = [
  { key: 'Fajr', time: '05:30', iqamaTime: '05:45' },
  { key: 'Sunrise', time: '06:52', iqamaTime: '\u2014' },
  { key: 'Dhuhr', time: '12:45', iqamaTime: '13:00' },
  { key: 'Asr', time: '16:15', iqamaTime: '16:30' },
  { key: 'Maghrib', time: DEFAULT_SUNSET_TIME, iqamaTime: '19:30' },
  { key: 'Isha', time: '20:45', iqamaTime: '21:00' },
];
