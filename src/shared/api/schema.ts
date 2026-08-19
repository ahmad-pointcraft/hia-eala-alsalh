import { z } from 'zod';
import { mosqueConfigSchema } from '@/shared/types/schema';

// ==================== SESSION ====================

export const sessionSchema = z.object({
  user: z.object({ id: z.string(), email: z.string() }),
  masjidId: z.string(),
  token: z.string(),
});

// ==================== DEVICE ====================

export const deviceSchema = z.object({
  id: z.string(),
  masjidId: z.string().nullable(),
  name: z.string(),
  status: z.enum(['paired', 'unpaired']),
  lastSeenAt: z.number().nullable(),
});

// ==================== PAIRING CODE ====================

export const pairingCodeSchema = z.object({
  code: z.string(),
  deviceId: z.string(),
  expiresAt: z.number(),
});

// ==================== MASJID SUMMARY ====================

export const masjidSummarySchema = z.object({
  id: z.string(),
  name_en: z.string(),
  name_ar: z.string(),
});

// ==================== ANNOUNCEMENT ====================

export const announcementSchema = z.object({
  id: z.string(),
  masjidId: z.string(),
  text_en: z.string(),
  text_ar: z.string(),
  active: z.boolean(),
  order: z.number().int().min(0),
}).refine(
  (d) => d.text_en.trim() || d.text_ar.trim(),
  { message: 'At least one language (AR or EN) is required', path: ['text'] },
);

export const announcementCreateSchema = announcementSchema.omit({ id: true, masjidId: true });
export const announcementUpdateSchema = announcementCreateSchema.partial();

// ==================== EVENT ====================

export const masjidEventSchema = z.object({
  id: z.string(),
  masjidId: z.string(),
  badge_en: z.string(),
  badge_ar: z.string(),
  title_en: z.string(),
  title_ar: z.string(),
  speaker_en: z.string(),
  speaker_ar: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must be HH:MM'),
  location_en: z.string(),
  location_ar: z.string(),
  cta_en: z.string(),
  cta_ar: z.string(),
  imageUrl: z.string().nullable(),
  active: z.boolean(),
}).refine(
  (d) => d.title_en.trim() || d.title_ar.trim(),
  { message: 'At least one language (AR or EN) is required', path: ['title'] },
);

export const masjidEventCreateSchema = masjidEventSchema.omit({ id: true, masjidId: true });
export const masjidEventUpdateSchema = masjidEventCreateSchema.partial();

// ==================== DONATION CAMPAIGN ====================

export const donationCampaignSchema = z.object({
  id: z.string(),
  masjidId: z.string(),
  title_en: z.string(),
  title_ar: z.string(),
  description_en: z.string(),
  description_ar: z.string(),
  collected: z.number().min(0),
  goal: z.number().positive('Goal must be greater than 0'),
  donorCount: z.number().int().min(0),
  donateUrl: z.string().nullable(),
  qrImageUrl: z.string().nullable(),
  active: z.boolean(),
}).refine(
  (d) => d.title_en.trim() || d.title_ar.trim(),
  { message: 'At least one language (AR or EN) is required', path: ['title'] },
).refine(
  (d) => d.description_en.trim() || d.description_ar.trim(),
  { message: 'At least one language (AR or EN) is required', path: ['description'] },
);

export const donationCreateSchema = donationCampaignSchema.omit({ id: true, masjidId: true });
export const donationUpdateSchema = donationCampaignSchema
  .omit({ id: true, masjidId: true, active: true })
  .partial();

// ==================== IMAGES ====================

export const imageKindSchema = z.enum(['carousel', 'event', 'qr']);

export const storedImageSchema = z.object({
  id: z.string(),
  masjidId: z.string(),
  url: z.string(),
  name: z.string(),
  kind: imageKindSchema,
  order: z.number().int().min(0),
});

// ==================== CONTENT CHANGE PAYLOAD ====================

export const contentChangePayloadSchema = z.object({
  announcements: z.array(announcementSchema).optional(),
  events: z.array(masjidEventSchema).optional(),
  donations: z.array(donationCampaignSchema).optional(),
  carouselImages: z.array(storedImageSchema).optional(),
});

// ==================== RE-EXPORT MOSQUE CONFIG ====================

export { mosqueConfigSchema };
