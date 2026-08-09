import type { MosqueConfig } from '@/shared/types';

export type { MosqueConfig };

export interface Session {
  user: { id: string; email: string };
  masjidId: string;
  token: string;
}

export interface Device {
  id: string;
  masjidId: string | null;
  name: string;
  status: 'paired' | 'unpaired';
  lastSeenAt: number | null;
}

export interface PairingCode {
  code: string;
  deviceId: string;
  expiresAt: number;
}

export interface MasjidSummary {
  id: string;
  name_en: string;
  name_ar: string;
}

export interface Announcement {
  id: string;
  masjidId: string;
  text_en: string;
  text_ar: string;
  active: boolean;
}

export interface MasjidEvent {
  id: string;
  masjidId: string;
  title_en: string;
  title_ar: string;
  date: string;
  time: string;
  active: boolean;
}

export interface DonationCampaign {
  id: string;
  masjidId: string;
  title_en: string;
  title_ar: string;
  collected: number;
  goal: number;
  active: boolean;
}

export interface StoredImage {
  id: string;
  masjidId: string;
  url: string;
  kind: 'carousel' | 'event';
}

export interface ContentChangePayload {
  announcements?: Announcement[];
  events?: MasjidEvent[];
  donations?: DonationCampaign[];
  carouselImages?: StoredImage[];
}
