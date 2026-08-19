import { z } from 'zod';

const BILINGUAL_MSG = 'At least one language (AR or EN) is required';

export const announcementFormSchema = z.object({
  text_en: z.string(),
  text_ar: z.string(),
}).refine(d => d.text_en.trim() || d.text_ar.trim(), { message: BILINGUAL_MSG, path: ['text'] });

export const donationFormSchema = z.object({
  title_en: z.string(),
  title_ar: z.string(),
  description_en: z.string(),
  description_ar: z.string(),
  collected: z.number().min(0, 'Collected must be \u2265 0'),
  goal: z.number().positive('Goal must be greater than 0'),
  donorCount: z.number().int().min(0, 'Donor count must be \u2265 0'),
  donateUrl: z.union([z.string(), z.null()]),
})
  .refine(d => d.title_en.trim() || d.title_ar.trim(), { message: BILINGUAL_MSG, path: ['title'] })
  .refine(d => d.description_en.trim() || d.description_ar.trim(), { message: BILINGUAL_MSG, path: ['description'] });

export const eventFormSchema = z.object({
  title_en: z.string(),
  title_ar: z.string(),
  badge_en: z.string(),
  badge_ar: z.string(),
  speaker_en: z.string(),
  speaker_ar: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM'),
  location_en: z.string(),
  location_ar: z.string(),
  cta_en: z.string(),
  cta_ar: z.string(),
}).refine(d => d.title_en.trim() || d.title_ar.trim(), { message: BILINGUAL_MSG, path: ['title'] });
