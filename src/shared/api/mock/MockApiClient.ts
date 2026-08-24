import {
  generateId,
  generateNumericCode,
  getExpirationTime,
  isExpired,
  MS_PER_MINUTE,
  MS_PER_DAY,
} from '@/shared/utils';
import type { ApiClient } from '../contract';
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
} from '../types';
import { DEMO_MASJID_ID, STORAGE_KEY, type MockStore, type MasjidData, loadStore, saveStore } from './seed';

// NORMALIZE STORE 
function normalizeStore(store: MockStore): MockStore {
  return {
    ...store,
    masjids: store.masjids ?? {},
    devices: store.devices ?? {},
    pairingCodes: store.pairingCodes ?? {},
    sessions: store.sessions ?? {},
    users: store.users ?? {},
    inviteCodes: store.inviteCodes ?? {},
    realtimeSubscribers: store.realtimeSubscribers ?? new Set(),
  };
}

const PAIRING_CODE_TTL_MS = 10 * MS_PER_MINUTE;

// ============================================================================
// MOCK API CLIENT (DEV & DEMO MODE) 
// ============================================================================

export function createMockApiClient(): ApiClient {
  const store = normalizeStore(loadStore());
  let currentSession: Session | null = null;

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) {
        // PRESERVE LIVE SUBSCRIBERS
        const subscribers = store.realtimeSubscribers;
        Object.assign(store, normalizeStore(loadStore()));
        store.realtimeSubscribers = subscribers;
        notifyAllSubscribers();
      }
    });
  }

  // ==================== PRIVATE HELPERS ====================

  // NOTIFY ALL SUBSCRIBERS ACROSS TABS WHEN STORAGE CHANGES
  function notifyAllSubscribers(): void {
    for (const sub of store.realtimeSubscribers) {
      const masjid = store.masjids[sub.masjidId];
      if (masjid) {
        sub.handlers.onConfigChange(masjid.config);
        sub.handlers.onContentChange({
          announcements: masjid.announcements,
          events: masjid.events,
          donations: masjid.donations,
          carouselImages: masjid.images.filter((i) => i.kind === 'carousel'),
        });
      }
    }
  }

  // PERSIST MOCK STORE TO LOCALSTORAGE
  function persist(): void {
    saveStore(store);
  }

  // NOTIFY SUBSCRIBERS OF CONFIG CHANGES FOR A SPECIFIC MASJID
  function notifyConfigChange(masjidId: string, config: MosqueConfig): void {
    for (const sub of store.realtimeSubscribers) {
      if (sub.masjidId === masjidId) {
        sub.handlers.onConfigChange(config);
      }
    }
  }

  // NOTIFY SUBSCRIBERS OF CONTENT CHANGES FOR A SPECIFIC MASJID (FULL-COLLECTION SNAPSHOT — P1-8)
  function notifyContentChange(masjidId: string, payload: ContentChangePayload): void {
    for (const sub of store.realtimeSubscribers) {
      if (sub.masjidId === masjidId) {
        sub.handlers.onContentChange(payload);
      }
    }
  }

  // FIND THE MASJID THAT OWNS AN ENTITY MATCHING THE PREDICATE (for id-keyed update/delete)
  function findMasjidByPredicate(
    pred: (m: MasjidData) => boolean,
  ): { masjidId: string; masjid: MasjidData } | null {
    for (const [masjidId, masjid] of Object.entries(store.masjids)) {
      if (pred(masjid)) return { masjidId, masjid };
    }
    return null;
  }

  // CAROUSEL IMAGES HELPER
  function carouselImages(masjid: MasjidData): StoredImage[] {
    return masjid.images.filter((i) => i.kind === 'carousel');
  }

  // ==================== AUTH API ====================

  // SIGN IN ADMIN USER
  async function signIn(email: string, _password: string): Promise<Session> {
    const session: Session = {
      user: {
        id: generateId('user'),
        email,
        name: 'Admin',
        role: 'masjid_admin',
        masjidId: DEMO_MASJID_ID,
        createdAt: '2026-01-01T00:00:00.000Z',
      },
      masjidId: DEMO_MASJID_ID,
      token: generateId('token'),
    };
    currentSession = session;
    return session;
  }

  // REGISTER NEW ADMIN ACCOUNT
  async function signUp(input: SignUpInput): Promise<Session> {
    return signIn(input.email, input.password);
  }

  // END CURRENT ADMIN SESSION
  async function signOut(): Promise<void> {
    currentSession = null;
  }

  // GET CURRENT ACTIVE SESSION
  async function getSession(): Promise<Session | null> {
    return currentSession;
  }

  // CREATE SINGLE-USE INVITE CODE
  async function createInviteCode(masjidId: string, role: UserRole): Promise<{ code: string; expiresAt: number }> {
    const code = generateNumericCode();
    const expiresAt = getExpirationTime(MS_PER_DAY);
    store.inviteCodes[code] = {
      code,
      masjidId,
      role,
      expiresAt,
      used: false,
    };
    persist();
    return { code, expiresAt };
  }

  // LIST ADMIN TEAM MEMBERS FOR A MASJID
  async function listTeamMembers(masjidId: string): Promise<User[]> {
    return Object.values(store.users)
      .filter((u) => u.user.masjidId === masjidId)
      .map((u) => u.user);
  }

  // ==================== DEVICE PAIRING API ====================

  // REGISTER UNPAIRED DISPLAY DEVICE & GENERATE 6-DIGIT CODE
  async function registerDevice(): Promise<{ deviceId: string; pairingCode: string; expiresAt: number }> {
    const deviceId = generateId('device');
    const pairingCode = generateNumericCode();
    const expiresAt = getExpirationTime(PAIRING_CODE_TTL_MS);

    store.devices[deviceId] = {
      id: deviceId,
      masjidId: null,
      name: 'Unnamed Device',
      status: 'unpaired',
      lastSeenAt: null,
    };
    store.pairingCodes[pairingCode] = { deviceId, expiresAt };
    persist();
    return { deviceId, pairingCode, expiresAt };
  }

  // QUERY DEVICE PAIRING STATUS & ASSIGNED MASJID ID
  async function getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }> {
    const device = store.devices[deviceId];
    if (!device) return { paired: false, masjidId: null };
    return { paired: device.status === 'paired', masjidId: device.masjidId };
  }

  // PAIR DEVICE USING 6-DIGIT CODE ENTERED IN ADMIN PORTAL (optional name labels it)
  async function pairDevice(pairingCode: string, name?: string): Promise<{ device: Device; masjid: MasjidSummary }> {
    const entry = store.pairingCodes[pairingCode];
    if (!entry || isExpired(entry.expiresAt)) {
      throw new Error('Invalid or expired pairing code');
    }
    const device = store.devices[entry.deviceId];
    if (!device) {
      throw new Error('Device not found for pairing code');
    }

    const masjidId = currentSession?.masjidId ?? DEMO_MASJID_ID;
    const masjidData = store.masjids[masjidId];
    if (!masjidData) {
      throw new Error('Masjid not found');
    }

    device.masjidId = masjidId;
    device.status = 'paired';
    device.lastSeenAt = Date.now();
    if (name && name.trim()) device.name = name.trim();
    delete store.pairingCodes[pairingCode];
    persist();

    const masjid: MasjidSummary = {
      id: masjidId,
      name_en: masjidData.config.masjidName_en,
      name_ar: masjidData.config.masjidName_ar,
    };
    return { device, masjid };
  }

  // LIST ALL DEVICES ASSIGNED TO A MASJID
  async function listDevices(masjidId: string): Promise<Device[]> {
    return Object.values(store.devices).filter((d) => d.masjidId === masjidId);
  }

  // UNPAIR DEVICE & BROADCAST UPDATE TO KIOSK SUBSCRIBERS
  async function unpairDevice(deviceId: string): Promise<void> {
    const device = store.devices[deviceId];
    if (device) {
      const oldMasjidId = device.masjidId;
      device.masjidId = null;
      device.status = 'unpaired';
      persist();
      if (oldMasjidId) {
        const masjid = store.masjids[oldMasjidId];
        if (masjid) {
          notifyConfigChange(oldMasjidId, masjid.config);
        }
      }
    }
  }

  // RENAME DISPLAY DEVICE
  async function renameDevice(deviceId: string, name: string): Promise<Device> {
    const device = store.devices[deviceId];
    if (!device) throw new Error('Device not found');
    device.name = name;
    persist();
    return device;
  }

  // ==================== CONTENT & CONFIG API ====================

  // GET FULL MOSQUE CONFIGURATION
  async function getMasjidConfig(masjidId: string): Promise<MosqueConfig> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    return masjid.config;
  }

  // UPDATE MOSQUE CONFIGURATION & NOTIFY LISTENERS
  async function updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    masjid.config = { ...masjid.config, ...patch };
    persist();
    notifyConfigChange(masjidId, masjid.config);
    return masjid.config;
  }

  // LIST ANNOUNCEMENTS FOR A MASJID
  async function listAnnouncements(masjidId: string): Promise<Announcement[]> {
    const masjid = store.masjids[masjidId];
    return masjid?.announcements ?? [];
  }

  // LIST COMMUNITY EVENTS FOR A MASJID
  async function listEvents(masjidId: string): Promise<MasjidEvent[]> {
    const masjid = store.masjids[masjidId];
    return masjid?.events ?? [];
  }

  // LIST DONATION CAMPAIGNS FOR A MASJID
  async function listDonations(masjidId: string): Promise<DonationCampaign[]> {
    const masjid = store.masjids[masjidId];
    return masjid?.donations ?? [];
  }

  // ==================== ANNOUNCEMENT WRITE OPS ====================

  // CREATE ANNOUNCEMENT (appended at end — order = max+1)
  async function createAnnouncement(masjidId: string, input: Omit<Announcement, 'id' | 'masjidId'>): Promise<Announcement> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const { order: _ignoredOrder, ...rest } = input;
    void _ignoredOrder;
    const order = masjid.announcements.length ? Math.max(...masjid.announcements.map((a) => a.order)) + 1 : 0;
    const announcement: Announcement = { id: generateId('ann'), masjidId, ...rest, order };
    masjid.announcements.push(announcement);
    persist();
    notifyContentChange(masjidId, { announcements: masjid.announcements });
    return announcement;
  }

  // UPDATE ANNOUNCEMENT (identity un-patchable via Update<T>)
  async function updateAnnouncement(id: string, patch: Partial<Omit<Announcement, 'id' | 'masjidId'>>): Promise<Announcement> {
    const found = findMasjidByPredicate((m) => m.announcements.some((a) => a.id === id));
    if (!found) throw new Error('Announcement not found');
    const { masjidId, masjid } = found;
    const target = masjid.announcements.find((a) => a.id === id);
    if (!target) throw new Error('Announcement not found');
    Object.assign(target, patch);
    persist();
    notifyContentChange(masjidId, { announcements: masjid.announcements });
    return target;
  }

  // DELETE ANNOUNCEMENT
  async function deleteAnnouncement(id: string): Promise<void> {
    const found = findMasjidByPredicate((m) => m.announcements.some((a) => a.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.announcements = masjid.announcements.filter((a) => a.id !== id);
    persist();
    notifyContentChange(masjidId, { announcements: masjid.announcements });
  }

  // REORDER ANNOUNCEMENTS — full id list → dense sequential order (FR-021)
  async function reorderAnnouncements(masjidId: string, orderedIds: string[]): Promise<void> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const byId = new Map(masjid.announcements.map((a) => [a.id, a]));
    const reordered: Announcement[] = [];
    let order = 0;
    for (const id of orderedIds) {
      const a = byId.get(id);
      if (a) {
        reordered.push({ ...a, order });
        order++;
      }
    }
    masjid.announcements = reordered;
    persist();
    notifyContentChange(masjidId, { announcements: masjid.announcements });
  }

  // ==================== EVENT WRITE OPS (ordered by date — no reorder) ====================

  // CREATE EVENT
  async function createEvent(masjidId: string, input: Omit<MasjidEvent, 'id' | 'masjidId'>): Promise<MasjidEvent> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const event: MasjidEvent = { id: generateId('evt'), masjidId, ...input };
    masjid.events.push(event);
    persist();
    notifyContentChange(masjidId, { events: masjid.events });
    return event;
  }

  // UPDATE EVENT (event image assigned here via { imageUrl } — P0-5)
  async function updateEvent(id: string, patch: Partial<Omit<MasjidEvent, 'id' | 'masjidId'>>): Promise<MasjidEvent> {
    const found = findMasjidByPredicate((m) => m.events.some((e) => e.id === id));
    if (!found) throw new Error('Event not found');
    const { masjidId, masjid } = found;
    const target = masjid.events.find((e) => e.id === id);
    if (!target) throw new Error('Event not found');
    Object.assign(target, patch);
    persist();
    notifyContentChange(masjidId, { events: masjid.events });
    return target;
  }

  // DELETE EVENT
  async function deleteEvent(id: string): Promise<void> {
    const found = findMasjidByPredicate((m) => m.events.some((e) => e.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.events = masjid.events.filter((e) => e.id !== id);
    persist();
    notifyContentChange(masjidId, { events: masjid.events });
  }

  // ==================== DONATION WRITE OPS ====================

  // CREATE DONATION CAMPAIGN (if active, deactivates the rest to preserve at-most-one — P1-7)
  async function createDonationCampaign(masjidId: string, input: Omit<DonationCampaign, 'id' | 'masjidId'>): Promise<DonationCampaign> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    if (input.active) {
      for (const d of masjid.donations) d.active = false;
    }
    const campaign: DonationCampaign = { id: generateId('don'), masjidId, ...input };
    masjid.donations.push(campaign);
    persist();
    notifyContentChange(masjidId, { donations: masjid.donations });
    return campaign;
  }

  // UPDATE DONATION CAMPAIGN (`active` excluded from patch type — P1-7, type-enforced)
  async function updateDonationCampaign(id: string, patch: Partial<Omit<DonationCampaign, 'id' | 'masjidId' | 'active'>>): Promise<DonationCampaign> {
    const found = findMasjidByPredicate((m) => m.donations.some((d) => d.id === id));
    if (!found) throw new Error('Donation campaign not found');
    const { masjidId, masjid } = found;
    const target = masjid.donations.find((d) => d.id === id);
    if (!target) throw new Error('Donation campaign not found');
    Object.assign(target, patch);
    persist();
    notifyContentChange(masjidId, { donations: masjid.donations });
    return target;
  }

  // DELETE DONATION CAMPAIGN (may leave zero-active — overlay falls back)
  async function deleteDonationCampaign(id: string): Promise<void> {
    const found = findMasjidByPredicate((m) => m.donations.some((d) => d.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.donations = masjid.donations.filter((d) => d.id !== id);
    persist();
    notifyContentChange(masjidId, { donations: masjid.donations });
  }

  // ACTIVATE ONE CAMPAIGN; ATOMICALLY DEACTIVATE THE REST (at-most-one-active — P1-7)
  async function setActiveDonationCampaign(masjidId: string, id: string): Promise<void> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    for (const d of masjid.donations) {
      d.active = d.id === id;
    }
    persist();
    notifyContentChange(masjidId, { donations: masjid.donations });
  }

  // ==================== IMAGE OPS ====================

  // UPLOAD IMAGE — mock returns a blob URL (P2-13); carousel appended at end (FR-021)
  async function uploadImage(masjidId: string, file: File, kind: ImageKind): Promise<StoredImage> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const url = URL.createObjectURL(file);
    const carousel = carouselImages(masjid);
    const order = kind === 'carousel' ? (carousel.length ? Math.max(...carousel.map((i) => i.order)) + 1 : 0) : 0;
    const image: StoredImage = { id: generateId('img'), masjidId, url, name: file.name, kind, order };
    masjid.images.push(image);
    persist();
    if (kind === 'carousel') {
      notifyContentChange(masjidId, { carouselImages: carouselImages(masjid) });
    }
    return image;
  }

  // LIST IMAGES OF A KIND
  async function listImages(masjidId: string, kind: ImageKind): Promise<StoredImage[]> {
    const masjid = store.masjids[masjidId];
    return (masjid?.images ?? []).filter((i) => i.kind === kind);
  }

  // DELETE IMAGE — revoke blob URL (P2-13)
  async function deleteImage(id: string): Promise<void> {
    const found = findMasjidByPredicate((m) => m.images.some((i) => i.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    const img = masjid.images.find((i) => i.id === id);
    if (img?.url.startsWith('blob:')) URL.revokeObjectURL(img.url);
    masjid.images = masjid.images.filter((i) => i.id !== id);
    persist();
    if (img?.kind === 'carousel') {
      notifyContentChange(masjidId, { carouselImages: carouselImages(masjid) });
    }
  }

  // REORDER CAROUSEL IMAGES — full id list → dense sequential order (P1-11, FR-021)
  async function reorderCarouselImages(masjidId: string, orderedIds: string[]): Promise<void> {
    const masjid = store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const byId = new Map(carouselImages(masjid).map((i) => [i.id, i]));
    const reordered: StoredImage[] = [];
    let order = 0;
    for (const id of orderedIds) {
      const img = byId.get(id);
      if (img) {
        reordered.push({ ...img, order });
        order++;
      }
    }
    // keep non-carousel images untouched
    masjid.images = [...reordered, ...masjid.images.filter((i) => i.kind !== 'carousel')];
    persist();
    notifyContentChange(masjidId, { carouselImages: carouselImages(masjid) });
  }

  // ==================== REALTIME SUBSCRIPTION ====================

  // SUBSCRIBE TO REAL-TIME CONFIG & CONTENT UPDATES
  function subscribe(
    masjidId: string,
    handlers: {
      onConfigChange(cfg: MosqueConfig): void;
      onContentChange(payload: ContentChangePayload): void;
    },
  ): () => void {
    const entry = { masjidId, handlers };
    store.realtimeSubscribers.add(entry);
    return () => {
      store.realtimeSubscribers.delete(entry);
    };
  }

  return {
    signIn,
    signUp,
    signOut,
    getSession,
    createInviteCode,
    listTeamMembers,
    registerDevice,
    getDeviceStatus,
    pairDevice,
    listDevices,
    unpairDevice,
    renameDevice,
    getMasjidConfig,
    updateMasjidConfig,
    listAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    reorderAnnouncements,
    listEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    listDonations,
    createDonationCampaign,
    updateDonationCampaign,
    deleteDonationCampaign,
    setActiveDonationCampaign,
    uploadImage,
    listImages,
    deleteImage,
    reorderCarouselImages,
    subscribe,
  };
}
