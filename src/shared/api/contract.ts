import type { Session, Device, MasjidSummary, MosqueConfig, ContentChangePayload, Announcement, MasjidEvent, DonationCampaign } from './types';

export interface AuthApi {
  signIn(email: string, password: string): Promise<Session>;
  signUp(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  getSession(): Promise<Session | null>;
}

export interface DeviceApi {
  registerDevice(): Promise<{ deviceId: string; pairingCode: string; expiresAt: number }>;
  getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }>;
  pairDevice(pairingCode: string): Promise<{ device: Device; masjid: MasjidSummary }>;
  listDevices(masjidId: string): Promise<Device[]>;
  unpairDevice(deviceId: string): Promise<void>;
  renameDevice(deviceId: string, name: string): Promise<Device>;
}

export interface ContentApi {
  getMasjidConfig(masjidId: string): Promise<MosqueConfig>;
  updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig>;
  listAnnouncements(masjidId: string): Promise<Announcement[]>;
  listEvents(masjidId: string): Promise<MasjidEvent[]>;
  listDonations(masjidId: string): Promise<DonationCampaign[]>;
}

export interface RealtimeApi {
  subscribe(
    masjidId: string,
    handlers: {
      onConfigChange(cfg: MosqueConfig): void;
      onContentChange(payload: ContentChangePayload): void;
    },
  ): () => void;
}

export interface ApiClient extends AuthApi, DeviceApi, ContentApi, RealtimeApi {}
