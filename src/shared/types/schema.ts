import { z } from 'zod';

// ==================== ENUMS ====================

export const adhanMethodSchema = z.enum([
  'MuslimWorldLeague',
  'Egyptian',
  'Karachi',
  'UmmAlQura',
  'Dubai',
  'Qatar',
  'Kuwait',
  'MoonsightingCommittee',
  'Singapore',
  'Turkey',
  'Tehran',
  'NorthAmerica',
]);

export const madhabSchema = z.enum(['Shafi', 'Hanafi']);

export const highLatitudeRuleSchema = z.enum([
  'MiddleOfTheNight',
  'SeventhOfTheNight',
  'TwilightAngle',
]);

// ==================== IQAMA CONFIG (discriminated union) ====================

export const iqamaPrayerConfigSchema = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('offset'), value: z.number().min(0).max(60) }),
  z.object({ mode: z.literal('fixed'), value: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Fixed time must be HH:MM') }),
]);

// ==================== MOSQUE CONFIG ====================

export const mosqueConfigSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  calculationMethod: adhanMethodSchema,
  madhab: madhabSchema,
  highLatitudeRule: highLatitudeRuleSchema,
  timeZone: z.string(),
  hijriOffset: z.union([z.literal(-2), z.literal(-1), z.literal(0), z.literal(1), z.literal(2)]),
  iqamaConfigs: z.object({
    Fajr: iqamaPrayerConfigSchema,
    Dhuhr: iqamaPrayerConfigSchema,
    Asr: iqamaPrayerConfigSchema,
    Maghrib: iqamaPrayerConfigSchema,
    Isha: iqamaPrayerConfigSchema,
  }),
  masjidName_en: z.string().min(1, 'Required'),
  masjidName_ar: z.string().min(1, 'Required'),
  clockOffsetMs: z.number(),
});

// ==================== HIJRI DATE INFO ====================

export const hijriDateInfoSchema = z.object({
  day: z.number(),
  month: z.number(),
  monthName_en: z.string(),
  monthName_ar: z.string(),
  year: z.number(),
  weekday_en: z.string(),
  weekday_ar: z.string(),
  formatted_en: z.string(),
  formatted_ar: z.string(),
});
