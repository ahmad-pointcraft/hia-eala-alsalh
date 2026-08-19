import type { z } from 'zod';
import {
  adhanMethodSchema,
  madhabSchema,
  highLatitudeRuleSchema,
  iqamaPrayerConfigSchema,
  mosqueConfigSchema,
  hijriDateInfoSchema,
} from './schema';

export type AdhanMethod = z.infer<typeof adhanMethodSchema>;
export type Madhab = z.infer<typeof madhabSchema>;
export type HighLatitudeRule = z.infer<typeof highLatitudeRuleSchema>;
export type IqamaPrayerConfig = z.infer<typeof iqamaPrayerConfigSchema>;
export type MosqueConfig = z.infer<typeof mosqueConfigSchema>;
export type HijriDateInfo = z.infer<typeof hijriDateInfoSchema>;

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
