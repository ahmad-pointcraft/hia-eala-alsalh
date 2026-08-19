import type { z } from 'zod';
import type { mosqueConfigSchema } from '@/shared/types/schema';
import {
  sessionSchema,
  deviceSchema,
  pairingCodeSchema,
  masjidSummarySchema,
  announcementSchema,
  masjidEventSchema,
  donationCampaignSchema,
  imageKindSchema,
  storedImageSchema,
  contentChangePayloadSchema,
  announcementCreateSchema,
  announcementUpdateSchema,
  masjidEventCreateSchema,
  masjidEventUpdateSchema,
  donationCreateSchema,
  donationUpdateSchema,
} from './schema';

export type MosqueConfig = z.infer<typeof mosqueConfigSchema>;

export type Session = z.infer<typeof sessionSchema>;
export type Device = z.infer<typeof deviceSchema>;
export type PairingCode = z.infer<typeof pairingCodeSchema>;
export type MasjidSummary = z.infer<typeof masjidSummarySchema>;
export type Announcement = z.infer<typeof announcementSchema>;
export type MasjidEvent = z.infer<typeof masjidEventSchema>;
export type DonationCampaign = z.infer<typeof donationCampaignSchema>;
export type ImageKind = z.infer<typeof imageKindSchema>;
export type StoredImage = z.infer<typeof storedImageSchema>;
export type ContentChangePayload = z.infer<typeof contentChangePayloadSchema>;

export type AnnouncementCreate = z.infer<typeof announcementCreateSchema>;
export type AnnouncementUpdate = z.infer<typeof announcementUpdateSchema>;
export type MasjidEventCreate = z.infer<typeof masjidEventCreateSchema>;
export type MasjidEventUpdate = z.infer<typeof masjidEventUpdateSchema>;
export type DonationCreate = z.infer<typeof donationCreateSchema>;
export type DonationUpdate = z.infer<typeof donationUpdateSchema>;
