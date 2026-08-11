import { generateId } from '@/shared/utils';
import type { ApiClient } from '../contract';
import type {
  Session,
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

const PAIRING_CODE_TTL_MS = 10 * 60 * 1000;

function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


// ============================================================================
// MOCK API CLIENT (DEV & DEMO MODE)
// ============================================================================

export class MockApiClient implements ApiClient {
  private store: MockStore;
  private currentSession: Session | null = null;

  constructor() {
    this.store = loadStore();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
          this.store = loadStore();
          this.notifyAllSubscribers();
        }
      });
    }
  }
// NOTIFY ALL SUBSCRIBERS ACROSS TABS WHEN STORAGE CHANGES

  private notifyAllSubscribers(): void {
    for (const sub of this.store.realtimeSubscribers) {
      const masjid = this.store.masjids[sub.masjidId];
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

  private persist(): void {
    saveStore(this.store);
  }

  // NOTIFY SUBSCRIBERS OF CONFIG CHANGES FOR A SPECIFIC MASJID
  private notifyConfigChange(masjidId: string, config: MosqueConfig): void {
    for (const sub of this.store.realtimeSubscribers) {
      if (sub.masjidId === masjidId) {
        sub.handlers.onConfigChange(config);
      }
    }
  }

  // NOTIFY SUBSCRIBERS OF CONTENT CHANGES FOR A SPECIFIC MASJID (FULL-COLLECTION SNAPSHOT — P1-8)
  private notifyContentChange(masjidId: string, payload: ContentChangePayload): void {
    for (const sub of this.store.realtimeSubscribers) {
      if (sub.masjidId === masjidId) {
        sub.handlers.onContentChange(payload);
      }
    }
  }

  // FIND THE MASJID THAT OWNS AN ENTITY MATCHING THE PREDICATE (for id-keyed update/delete)
  private findMasjidByPredicate(
    pred: (m: MasjidData) => boolean,
  ): { masjidId: string; masjid: MasjidData } | null {
    for (const [masjidId, masjid] of Object.entries(this.store.masjids)) {
      if (pred(masjid)) return { masjidId, masjid };
    }
    return null;
  }

  // CAROUSEL IMAGES HELPER
  private carouselImages(masjid: MasjidData): StoredImage[] {
    return masjid.images.filter((i) => i.kind === 'carousel');
  }

  // ============================================================================
  // AUTH API
  // ============================================================================

  // SIGN IN ADMIN USER
  async signIn(email: string, _password: string): Promise<Session> {
    const session: Session = {
      user: { id: generateId('user'), email },
      masjidId: DEMO_MASJID_ID,
      token: generateId('token'),
    };
    this.currentSession = session;
    return session;
  }

  // REGISTER NEW ADMIN ACCOUNT
  async signUp(email: string, _password: string): Promise<Session> {
    return this.signIn(email, _password);
  }

  // END CURRENT ADMIN SESSION
  async signOut(): Promise<void> {
    this.currentSession = null;
  }

  // GET CURRENT ACTIVE SESSION
  async getSession(): Promise<Session | null> {
    return this.currentSession;
  }

  // ============================================================================
  // DEVICE PAIRING API
  // ============================================================================

  // REGISTER UNPAIRED DISPLAY DEVICE & GENERATE 6-DIGIT CODE
  async registerDevice(): Promise<{ deviceId: string; pairingCode: string; expiresAt: number }> {
    const deviceId = generateId('device');
    const pairingCode = generatePairingCode();
    const expiresAt = Date.now() + PAIRING_CODE_TTL_MS;

    this.store.devices[deviceId] = {
      id: deviceId,
      masjidId: null,
      name: 'Unnamed Device',
      status: 'unpaired',
      lastSeenAt: null,
    };
    this.store.pairingCodes[pairingCode] = { deviceId, expiresAt };
    this.persist();
    return { deviceId, pairingCode, expiresAt };
  }

  // QUERY DEVICE PAIRING STATUS & ASSIGNED MASJID ID
  async getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }> {
    const device = this.store.devices[deviceId];
    if (!device) return { paired: false, masjidId: null };
    return { paired: device.status === 'paired', masjidId: device.masjidId };
  }

  // PAIR DEVICE USING 6-DIGIT CODE ENTERED IN ADMIN PORTAL
  async pairDevice(pairingCode: string): Promise<{ device: Device; masjid: MasjidSummary }> {
    const entry = this.store.pairingCodes[pairingCode];
    if (!entry || entry.expiresAt < Date.now()) {
      throw new Error('Invalid or expired pairing code');
    }
    const device = this.store.devices[entry.deviceId];
    if (!device) {
      throw new Error('Device not found for pairing code');
    }

    const masjidId = this.currentSession?.masjidId ?? DEMO_MASJID_ID;
    const masjidData = this.store.masjids[masjidId];
    if (!masjidData) {
      throw new Error('Masjid not found');
    }

    device.masjidId = masjidId;
    device.status = 'paired';
    device.lastSeenAt = Date.now();
    delete this.store.pairingCodes[pairingCode];
    this.persist();

    const masjid: MasjidSummary = {
      id: masjidId,
      name_en: masjidData.config.masjidName_en,
      name_ar: masjidData.config.masjidName_ar,
    };
    return { device, masjid };
  }

  // LIST ALL DEVICES ASSIGNED TO A MASJID
  async listDevices(masjidId: string): Promise<Device[]> {
    return Object.values(this.store.devices).filter((d) => d.masjidId === masjidId);
  }

  // UNPAIR DEVICE & BROADCAST UPDATE TO KIOSK SUBSCRIBERS
  async unpairDevice(deviceId: string): Promise<void> {
    const device = this.store.devices[deviceId];
    if (device) {
      const oldMasjidId = device.masjidId;
      device.masjidId = null;
      device.status = 'unpaired';
      this.persist();
      if (oldMasjidId) {
        const masjid = this.store.masjids[oldMasjidId];
        if (masjid) {
          this.notifyConfigChange(oldMasjidId, masjid.config);
        }
      }
    }
  }

  // RENAME DISPLAY DEVICE
  async renameDevice(deviceId: string, name: string): Promise<Device> {
    const device = this.store.devices[deviceId];
    if (!device) throw new Error('Device not found');
    device.name = name;
    this.persist();
    return device;
  }

  // ============================================================================
  // CONTENT & CONFIG API
  // ============================================================================

  // GET FULL MOSQUE CONFIGURATION
  async getMasjidConfig(masjidId: string): Promise<MosqueConfig> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    return masjid.config;
  }

  // UPDATE MOSQUE CONFIGURATION & NOTIFY LISTENERS
  async updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    masjid.config = { ...masjid.config, ...patch };
    this.persist();
    this.notifyConfigChange(masjidId, masjid.config);
    return masjid.config;
  }

  // LIST ANNOUNCEMENTS FOR A MASJID
  async listAnnouncements(masjidId: string): Promise<Announcement[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.announcements ?? [];
  }

  // LIST COMMUNITY EVENTS FOR A MASJID
  async listEvents(masjidId: string): Promise<MasjidEvent[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.events ?? [];
  }

  // LIST DONATION CAMPAIGNS FOR A MASJID
  async listDonations(masjidId: string): Promise<DonationCampaign[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.donations ?? [];
  }

  // ==================== ANNOUNCEMENT WRITE OPS ====================

  // CREATE ANNOUNCEMENT (appended at end — order = max+1)
  async createAnnouncement(masjidId: string, input: Omit<Announcement, 'id' | 'masjidId'>): Promise<Announcement> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const { order: _ignoredOrder, ...rest } = input;
    void _ignoredOrder;
    const order = masjid.announcements.length ? Math.max(...masjid.announcements.map((a) => a.order)) + 1 : 0;
    const announcement: Announcement = { id: generateId('ann'), masjidId, ...rest, order };
    masjid.announcements.push(announcement);
    this.persist();
    this.notifyContentChange(masjidId, { announcements: masjid.announcements });
    return announcement;
  }

  // UPDATE ANNOUNCEMENT (identity un-patchable via Update<T>)
  async updateAnnouncement(id: string, patch: Partial<Omit<Announcement, 'id' | 'masjidId'>>): Promise<Announcement> {
    const found = this.findMasjidByPredicate((m) => m.announcements.some((a) => a.id === id));
    if (!found) throw new Error('Announcement not found');
    const { masjidId, masjid } = found;
    const target = masjid.announcements.find((a) => a.id === id);
    if (!target) throw new Error('Announcement not found');
    Object.assign(target, patch);
    this.persist();
    this.notifyContentChange(masjidId, { announcements: masjid.announcements });
    return target;
  }

  // DELETE ANNOUNCEMENT
  async deleteAnnouncement(id: string): Promise<void> {
    const found = this.findMasjidByPredicate((m) => m.announcements.some((a) => a.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.announcements = masjid.announcements.filter((a) => a.id !== id);
    this.persist();
    this.notifyContentChange(masjidId, { announcements: masjid.announcements });
  }

  // REORDER ANNOUNCEMENTS — full id list → dense sequential order (FR-021)
  async reorderAnnouncements(masjidId: string, orderedIds: string[]): Promise<void> {
    const masjid = this.store.masjids[masjidId];
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
    this.persist();
    this.notifyContentChange(masjidId, { announcements: masjid.announcements });
  }

  // ==================== EVENT WRITE OPS (ordered by date — no reorder) ====================

  // CREATE EVENT
  async createEvent(masjidId: string, input: Omit<MasjidEvent, 'id' | 'masjidId'>): Promise<MasjidEvent> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const event: MasjidEvent = { id: generateId('evt'), masjidId, ...input };
    masjid.events.push(event);
    this.persist();
    this.notifyContentChange(masjidId, { events: masjid.events });
    return event;
  }

  // UPDATE EVENT (event image assigned here via { imageUrl } — P0-5)
  async updateEvent(id: string, patch: Partial<Omit<MasjidEvent, 'id' | 'masjidId'>>): Promise<MasjidEvent> {
    const found = this.findMasjidByPredicate((m) => m.events.some((e) => e.id === id));
    if (!found) throw new Error('Event not found');
    const { masjidId, masjid } = found;
    const target = masjid.events.find((e) => e.id === id);
    if (!target) throw new Error('Event not found');
    Object.assign(target, patch);
    this.persist();
    this.notifyContentChange(masjidId, { events: masjid.events });
    return target;
  }

  // DELETE EVENT
  async deleteEvent(id: string): Promise<void> {
    const found = this.findMasjidByPredicate((m) => m.events.some((e) => e.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.events = masjid.events.filter((e) => e.id !== id);
    this.persist();
    this.notifyContentChange(masjidId, { events: masjid.events });
  }

  // ==================== DONATION WRITE OPS ====================

  // CREATE DONATION CAMPAIGN (if active, deactivates the rest to preserve at-most-one — P1-7)
  async createDonationCampaign(masjidId: string, input: Omit<DonationCampaign, 'id' | 'masjidId'>): Promise<DonationCampaign> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    if (input.active) {
      for (const d of masjid.donations) d.active = false;
    }
    const campaign: DonationCampaign = { id: generateId('don'), masjidId, ...input };
    masjid.donations.push(campaign);
    this.persist();
    this.notifyContentChange(masjidId, { donations: masjid.donations });
    return campaign;
  }

  // UPDATE DONATION CAMPAIGN (`active` excluded from patch type — P1-7, type-enforced)
  async updateDonationCampaign(id: string, patch: Partial<Omit<DonationCampaign, 'id' | 'masjidId' | 'active'>>): Promise<DonationCampaign> {
    const found = this.findMasjidByPredicate((m) => m.donations.some((d) => d.id === id));
    if (!found) throw new Error('Donation campaign not found');
    const { masjidId, masjid } = found;
    const target = masjid.donations.find((d) => d.id === id);
    if (!target) throw new Error('Donation campaign not found');
    Object.assign(target, patch);
    this.persist();
    this.notifyContentChange(masjidId, { donations: masjid.donations });
    return target;
  }

  // DELETE DONATION CAMPAIGN (may leave zero-active — overlay falls back)
  async deleteDonationCampaign(id: string): Promise<void> {
    const found = this.findMasjidByPredicate((m) => m.donations.some((d) => d.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    masjid.donations = masjid.donations.filter((d) => d.id !== id);
    this.persist();
    this.notifyContentChange(masjidId, { donations: masjid.donations });
  }

  // ACTIVATE ONE CAMPAIGN; ATOMICALLY DEACTIVATE THE REST (at-most-one-active — P1-7)
  async setActiveDonationCampaign(masjidId: string, id: string): Promise<void> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    for (const d of masjid.donations) {
      d.active = d.id === id;
    }
    this.persist();
    this.notifyContentChange(masjidId, { donations: masjid.donations });
  }

  // ==================== IMAGE OPS ====================

  // UPLOAD IMAGE — mock returns a blob URL (P2-13); carousel appended at end (FR-021)
  async uploadImage(masjidId: string, file: File, kind: ImageKind): Promise<StoredImage> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const url = URL.createObjectURL(file);
    const carousel = this.carouselImages(masjid);
    const order = kind === 'carousel' ? (carousel.length ? Math.max(...carousel.map((i) => i.order)) + 1 : 0) : 0;
    const image: StoredImage = { id: generateId('img'), masjidId, url, name: file.name, kind, order };
    masjid.images.push(image);
    this.persist();
    if (kind === 'carousel') {
      this.notifyContentChange(masjidId, { carouselImages: this.carouselImages(masjid) });
    }
    return image;
  }

  // LIST IMAGES OF A KIND
  async listImages(masjidId: string, kind: ImageKind): Promise<StoredImage[]> {
    const masjid = this.store.masjids[masjidId];
    return (masjid?.images ?? []).filter((i) => i.kind === kind);
  }

  // DELETE IMAGE — revoke blob URL (P2-13)
  async deleteImage(id: string): Promise<void> {
    const found = this.findMasjidByPredicate((m) => m.images.some((i) => i.id === id));
    if (!found) return;
    const { masjidId, masjid } = found;
    const img = masjid.images.find((i) => i.id === id);
    if (img?.url.startsWith('blob:')) URL.revokeObjectURL(img.url);
    masjid.images = masjid.images.filter((i) => i.id !== id);
    this.persist();
    if (img?.kind === 'carousel') {
      this.notifyContentChange(masjidId, { carouselImages: this.carouselImages(masjid) });
    }
  }

  // REORDER CAROUSEL IMAGES — full id list → dense sequential order (P1-11, FR-021)
  async reorderCarouselImages(masjidId: string, orderedIds: string[]): Promise<void> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    const byId = new Map(this.carouselImages(masjid).map((i) => [i.id, i]));
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
    this.persist();
    this.notifyContentChange(masjidId, { carouselImages: this.carouselImages(masjid) });
  }

  // ============================================================================
  // REALTIME SUBSCRIPTION
  // ============================================================================

  // SUBSCRIBE TO REAL-TIME CONFIG & CONTENT UPDATES
  subscribe(
    masjidId: string,
    handlers: {
      onConfigChange(cfg: MosqueConfig): void;
      onContentChange(payload: ContentChangePayload): void;
    },
  ): () => void {
    const entry = { masjidId, handlers };
    this.store.realtimeSubscribers.add(entry);
    return () => {
      this.store.realtimeSubscribers.delete(entry);
    };
  }
}
