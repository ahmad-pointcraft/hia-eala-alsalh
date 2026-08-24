import { z } from 'zod';
import { mosqueConfigSchema } from '@/shared/types/schema';

// ==================== USER & ROLE ====================

export const userRoleSchema = z.enum(['masjid_admin', 'content_editor']);

export const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().optional().default('Admin'),
  role: userRoleSchema.optional().default('masjid_admin'),
  masjidId: z.string().optional(),
  createdAt: z.string().optional(),
});

// ==================== SESSION ====================

export const sessionSchema = z.object({
  user: userSchema,
  masjidId: z.string(),
  token: z.string(),
  expiresAt: z.number().optional(),
});

// ==================== INVITE CODE ====================

export const inviteCodeSchema = z.object({
  code: z.string().length(6),
  masjidId: z.string(),
  role: userRoleSchema,
  expiresAt: z.number(),
  used: z.boolean(),
});

// ==================== SIGN UP INPUTS ====================

const baseSignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const createMasjidSignUpSchema = baseSignUpSchema.extend({
  mode: z.literal('create'),
  masjidName_en: z.string().min(1, 'English masjid name is required'),
  masjidName_ar: z.string().min(1, 'Arabic masjid name is required'),
});

export const joinMasjidSignUpSchema = baseSignUpSchema.extend({
  mode: z.literal('join'),
  inviteCode: z.string().length(6, 'Invite code must be 6 digits'),
});

export const signUpInputSchema = z.discriminatedUnion('mode', [
  createMasjidSignUpSchema,
  joinMasjidSignUpSchema,
]);

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

// ==================== BILINGUAL RULE ====================

export const BILINGUAL_MSG = 'At least one language (AR or EN) is required';

export function hasOneLanguage(en: string, ar: string): boolean {
  return Boolean(en.trim() || ar.trim());
}

// ==================== ANNOUNCEMENT ====================

const announcementShape = z.object({
  id: z.string(),
  masjidId: z.string(),
  text_en: z.string(),
  text_ar: z.string(),
  active: z.boolean(),
  order: z.number().int().min(0),
});

export const announcementSchema = announcementShape.refine(
  (d) => hasOneLanguage(d.text_en, d.text_ar),
  { message: BILINGUAL_MSG, path: ['text'] },
);

export const announcementCreateSchema = announcementShape.omit({ id: true, masjidId: true });
export const announcementUpdateSchema = announcementCreateSchema.partial();

// ==================== EVENT ====================

const masjidEventShape = z.object({
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
});

export const masjidEventSchema = masjidEventShape.refine(
  (d) => hasOneLanguage(d.title_en, d.title_ar),
  { message: BILINGUAL_MSG, path: ['title'] },
);

export const masjidEventCreateSchema = masjidEventShape.omit({ id: true, masjidId: true });
export const masjidEventUpdateSchema = masjidEventCreateSchema.partial();

// ==================== DONATION CAMPAIGN ====================

const donationCampaignShape = z.object({
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
});

export const donationCampaignSchema = donationCampaignShape
  .refine((d) => hasOneLanguage(d.title_en, d.title_ar), { message: BILINGUAL_MSG, path: ['title'] })
  .refine((d) => hasOneLanguage(d.description_en, d.description_ar), { message: BILINGUAL_MSG, path: ['description'] });

export const donationCreateSchema = donationCampaignShape.omit({ id: true, masjidId: true });
export const donationUpdateSchema = donationCampaignShape
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
