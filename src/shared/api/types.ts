import type { z } from 'zod';
import type { mosqueConfigSchema } from '@/shared/types/schema';
import {
  userRoleSchema,
  userSchema,
  sessionSchema,
  inviteCodeSchema,
  signUpInputSchema,
  createMasjidSignUpSchema,
  joinMasjidSignUpSchema,
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

export type UserRole = z.infer<typeof userRoleSchema>;
export type User = z.infer<typeof userSchema>;
export type Session = z.infer<typeof sessionSchema>;
export type InviteCode = z.infer<typeof inviteCodeSchema>;
export type SignUpInput = z.infer<typeof signUpInputSchema>;
export type CreateMasjidSignUp = z.infer<typeof createMasjidSignUpSchema>;
export type JoinMasjidSignUp = z.infer<typeof joinMasjidSignUpSchema>;
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
