import type { PrayerKey } from './prayer';

export type AdhanMethod =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'Qatar'
  | 'Kuwait'
  | 'MoonsightingCommittee'
  | 'Singapore'
  | 'Turkey'
  | 'Tehran'
  | 'NorthAmerica';

export type Madhab = 'Shafi' | 'Hanafi';

export type HighLatitudeRule =
  | 'MiddleOfTheNight'
  | 'SeventhOfTheNight'
  | 'TwilightAngle';

export type IqamaPrayerConfig =
  | { mode: 'offset'; value: number }
  | { mode: 'fixed'; value: string };

export interface MosqueConfig {
  latitude: number;
  longitude: number;
  calculationMethod: AdhanMethod;
  madhab: Madhab;
  highLatitudeRule: HighLatitudeRule;
  timeZone: string;
  hijriOffset: -2 | -1 | 0 | 1 | 2;
  iqamaConfigs: Record<Exclude<PrayerKey, 'Sunrise'>, IqamaPrayerConfig>;
  masjidName_en: string;
  masjidName_ar: string;
  clockOffsetMs: number;
}

export interface HijriDateInfo {
  day: number;
  month: number;
  monthName_en: string;
  monthName_ar: string;
  year: number;
  weekday_en: string;
  weekday_ar: string;
  formatted_en: string;
  formatted_ar: string;
}

export function formatHijriDate(
  info: HijriDateInfo,
  language: 'ar' | 'en',
): string {
  if (language === 'ar') {
    return info.formatted_ar;
  }
  return info.formatted_en;
}

export const DEFAULT_MOSQUE_CONFIG: MosqueConfig = {
  latitude: 24.7136,
  longitude: 46.6753,
  calculationMethod: 'MuslimWorldLeague',
  madhab: 'Shafi',
  highLatitudeRule: 'MiddleOfTheNight',
  timeZone: 'Asia/Riyadh',
  hijriOffset: 0,
  iqamaConfigs: {
    Fajr: { mode: 'offset', value: 20 },
    Dhuhr: { mode: 'offset', value: 15 },
    Asr: { mode: 'offset', value: 15 },
    Maghrib: { mode: 'offset', value: 5 },
    Isha: { mode: 'offset', value: 15 },
  },
  masjidName_en: 'Mosque',
  masjidName_ar: '\u0645\u0633\u062C\u062F',
  clockOffsetMs: 0,
};
