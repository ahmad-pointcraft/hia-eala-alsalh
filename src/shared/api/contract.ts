import type { Session, Device, MasjidSummary, MosqueConfig, ContentChangePayload, Announcement, MasjidEvent, DonationCampaign } from './types';

/**
 * Authentication operations for admin users.
 */
export interface AuthApi {
  /** Authenticates an admin user with email and password credentials. */
  signIn(email: string, password: string): Promise<Session>;

  /** Registers a new admin account. */
  signUp(email: string, password: string): Promise<Session>;

  /** Signs out the current admin user session. */
  signOut(): Promise<void>;

  /** Retrieves the active admin user session, or null if unauthenticated. */
  getSession(): Promise<Session | null>;
}

/**
 * Operations for display device registration, pairing, status querying, and unpairing.
 */
export interface DeviceApi {
  /** Registers an unpaired display device on boot and returns a 6-digit pairing code. */
  registerDevice(): Promise<{ deviceId: string; pairingCode: string; expiresAt: number }>;

  /** Checks whether a display device is currently paired to a masjid. */
  getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }>;

  /** Pairs an unpaired display device using a 6-digit numeric pairing code. */
  pairDevice(pairingCode: string): Promise<{ device: Device; masjid: MasjidSummary }>;

  /** Lists all display devices registered under a specific masjid ID. */
  listDevices(masjidId: string): Promise<Device[]>;

  /** Unpairs a display device and broadcasts the state change to subscribers. */
  unpairDevice(deviceId: string): Promise<void>;

  /** Renames a display device in the admin list. */
  renameDevice(deviceId: string, name: string): Promise<Device>;
}

/**
 * Operations for fetching and updating mosque configurations and content.
 */
export interface ContentApi {
  /** Retrieves the mosque configuration (coordinates, calculation method, names, offsets). */
  getMasjidConfig(masjidId: string): Promise<MosqueConfig>;

  /** Applies partial updates to a mosque configuration and broadcasts changes to clients. */
  updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig>;

  /** Lists announcements for a masjid. */
  listAnnouncements(masjidId: string): Promise<Announcement[]>;

  /** Lists community events for a masjid. */
  listEvents(masjidId: string): Promise<MasjidEvent[]>;

  /** Lists active donation campaigns for a masjid. */
  listDonations(masjidId: string): Promise<DonationCampaign[]>;
}

/**
 * Real-time event subscription operations.
 */
export interface RealtimeApi {
  /** Subscribes to real-time configuration and content changes for a masjid. */
  subscribe(
    masjidId: string,
    handlers: {
      onConfigChange(cfg: MosqueConfig): void;
      onContentChange(payload: ContentChangePayload): void;
    },
  ): () => void;
}

/**
 * Full API Client contract composing Auth, Device, Content, and Realtime APIs.
 */
export interface ApiClient extends AuthApi, DeviceApi, ContentApi, RealtimeApi {}
