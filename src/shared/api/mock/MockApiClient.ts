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
} from '../types';
import { DEMO_MASJID_ID, STORAGE_KEY, type MockStore, loadStore, saveStore } from './seed';

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
