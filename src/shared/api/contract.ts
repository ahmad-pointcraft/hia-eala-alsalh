import type {
  Session,
  User,
  UserRole,
  SignUpInput,
  Device,
  MasjidSummary,
  MosqueConfig,
  ContentChangePayload,
  Announcement,
  MasjidEvent,
  DonationCampaign,
  StoredImage,
  ImageKind,
} from './types';

/**
 * Authentication operations for admin users.
 */
export interface AuthApi {
  /** Authenticates an admin user with email and password credentials. */
  signIn(email: string, password: string): Promise<Session>;

  /**
   * Registers a new account either by creating a new masjid or joining via an invite code.
   * In create mode: provisions a new masjid and registers the user as masjid_admin.
   * In join mode: redeems a single-use invite code and registers the user with the assigned role.
   */
  signUp(input: SignUpInput): Promise<Session>;

  /** Signs out the current admin user session. */
  signOut(): Promise<void>;

  /** Retrieves the active admin user session, or null if unauthenticated or expired. */
  getSession(): Promise<Session | null>;

  /**
   * Generates a 6-digit single-use invite code for a specific masjid and role.
   * Admin-gated: caller must possess 'team:manage' permission (masjid_admin).
   */
  createInviteCode(masjidId: string, role: UserRole): Promise<{ code: string; expiresAt: number }>;

  /** Lists all registered administrative team members for a specific masjid. */
  listTeamMembers(masjidId: string): Promise<User[]>;
}

/**
 * Operations for display device registration, pairing, status querying, and unpairing.
 */
export interface DeviceApi {
  /** Registers an unpaired display device on boot and returns a 6-digit pairing code. */
  registerDevice(): Promise<{ deviceId: string; pairingCode: string; expiresAt: number }>;

  /** Checks whether a display device is currently paired to a masjid. */
  getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }>;

  /** Pairs an unpaired display device using a 6-digit numeric pairing code. Optional `name` labels the device at pair time. */
  pairDevice(
    pairingCode: string,
    name?: string,
  ): Promise<{ device: Device; masjid: MasjidSummary }>;

  /** Lists all display devices registered under a specific masjid ID. */
  listDevices(masjidId: string): Promise<Device[]>;

  /** Unpairs a display device and broadcasts the state change to subscribers. */
  unpairDevice(deviceId: string): Promise<void>;

  /** Renames a display device in the admin list. */
  renameDevice(deviceId: string, name: string): Promise<Device>;
}

/**
 * Patch shape accepted by every `update*` method. Excludes the immutable
 * identity fields so they cannot be patched. (P0-4)
 *
 * Note: `Update<DonationCampaign>` additionally omits `active` — activation
 * flows only through `setActiveDonationCampaign`.
 */
export type Update<T> = Partial<Omit<T, 'id' | 'masjidId'>>;

/**
 * Operations for fetching and updating mosque configurations and content.
 */
export interface ContentApi {
  // CONFIG
  /** Retrieves the mosque configuration (coordinates, calculation method, names, offsets). */
  getMasjidConfig(masjidId: string): Promise<MosqueConfig>;
  /** Applies partial updates to a mosque configuration and broadcasts changes to clients. */
  updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig>;

  // ANNOUNCEMENTS
  /** Lists announcements for a masjid. */
  listAnnouncements(masjidId: string): Promise<Announcement[]>;
  /** Creates an announcement (appended at the end — order = max existing + 1, or 0). */
  createAnnouncement(
    masjidId: string,
    input: Omit<Announcement, 'id' | 'masjidId'>,
  ): Promise<Announcement>;
  /** Partial-updates an announcement; identity fields are un-patchable via `Update<T>`. */
  updateAnnouncement(id: string, patch: Update<Announcement>): Promise<Announcement>;
  /** Deletes an announcement. */
  deleteAnnouncement(id: string): Promise<void>;
  /** Reorders announcements; `orderedIds` is the full new sequence (dense order persisted). */
  reorderAnnouncements(masjidId: string, orderedIds: string[]): Promise<void>;

  // EVENTS (ordered by date — no reorder)
  /** Lists community events for a masjid. */
  listEvents(masjidId: string): Promise<MasjidEvent[]>;
  /** Creates an event. */
  createEvent(masjidId: string, input: Omit<MasjidEvent, 'id' | 'masjidId'>): Promise<MasjidEvent>;
  /** Partial-updates an event (event image assigned here via `{ imageUrl }` — P0-5). */
  updateEvent(id: string, patch: Update<MasjidEvent>): Promise<MasjidEvent>;
  /** Deletes an event. */
  deleteEvent(id: string): Promise<void>;

  // DONATIONS
  /** Lists donation campaigns for a masjid. */
  listDonations(masjidId: string): Promise<DonationCampaign[]>;
  /** Creates a donation campaign. */
  createDonationCampaign(
    masjidId: string,
    input: Omit<DonationCampaign, 'id' | 'masjidId'>,
  ): Promise<DonationCampaign>;
  /** Partial-updates a campaign. `active` is NOT patchable — it is excluded from the patch type so activation flows ONLY through `setActiveDonationCampaign` . */
  updateDonationCampaign(
    id: string,
    patch: Partial<Omit<DonationCampaign, 'id' | 'masjidId' | 'active'>>,
  ): Promise<DonationCampaign>;
  /** Deletes a donation campaign. */
  deleteDonationCampaign(id: string): Promise<void>;
  /** Activates one campaign and atomically deactivates the rest (the at-most-one-active invariant). */
  setActiveDonationCampaign(masjidId: string, id: string): Promise<void>;

  // IMAGES
  /** Uploads an image of the given kind (`'carousel'` rotates; `'event'`/`'qr'` are attributes). Mock returns a blob URL. */
  uploadImage(masjidId: string, file: File, kind: ImageKind): Promise<StoredImage>;
  /** Lists stored images of a kind for a masjid. */
  listImages(masjidId: string, kind: ImageKind): Promise<StoredImage[]>;
  /** Deletes a stored image; the mock revokes its object URL (P2-13). */
  deleteImage(id: string): Promise<void>;
  /** Reorders carousel images; `orderedIds` is the full new sequence (P1-11). */
  reorderCarouselImages(masjidId: string, orderedIds: string[]): Promise<void>;
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
