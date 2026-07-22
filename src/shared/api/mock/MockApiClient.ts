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
import { DEMO_MASJID_ID, type MockStore, loadStore, saveStore } from './seed';

const PAIRING_CODE_TTL_MS = 10 * 60 * 1000;

function generatePairingCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


export class MockApiClient implements ApiClient {
  private store: MockStore;
  private currentSession: Session | null = null;

  constructor() {
    this.store = loadStore();
  }

  private persist(): void {
    saveStore(this.store);
  }

  private notifyConfigChange(masjidId: string, config: MosqueConfig): void {
    for (const sub of this.store.realtimeSubscribers) {
      if (sub.masjidId === masjidId) {
        sub.handlers.onConfigChange(config);
      }
    }
  }

  async signIn(email: string, _password: string): Promise<Session> {
    const session: Session = {
      user: { id: generateId('user'), email },
      masjidId: DEMO_MASJID_ID,
      token: generateId('token'),
    };
    this.currentSession = session;
    return session;
  }

  async signUp(email: string, _password: string): Promise<Session> {
    return this.signIn(email, _password);
  }

  async signOut(): Promise<void> {
    this.currentSession = null;
  }

  async getSession(): Promise<Session | null> {
    return this.currentSession;
  }

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

  async getDeviceStatus(deviceId: string): Promise<{ paired: boolean; masjidId: string | null }> {
    const device = this.store.devices[deviceId];
    if (!device) return { paired: false, masjidId: null };
    return { paired: device.status === 'paired', masjidId: device.masjidId };
  }

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

  async listDevices(masjidId: string): Promise<Device[]> {
    return Object.values(this.store.devices).filter((d) => d.masjidId === masjidId);
  }

  async unpairDevice(deviceId: string): Promise<void> {
    const device = this.store.devices[deviceId];
    if (device) {
      device.masjidId = null;
      device.status = 'unpaired';
      this.persist();
    }
  }

  async renameDevice(deviceId: string, name: string): Promise<Device> {
    const device = this.store.devices[deviceId];
    if (!device) throw new Error('Device not found');
    device.name = name;
    this.persist();
    return device;
  }

  async getMasjidConfig(masjidId: string): Promise<MosqueConfig> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    return masjid.config;
  }

  async updateMasjidConfig(masjidId: string, patch: Partial<MosqueConfig>): Promise<MosqueConfig> {
    const masjid = this.store.masjids[masjidId];
    if (!masjid) throw new Error('Masjid not found');
    masjid.config = { ...masjid.config, ...patch };
    this.persist();
    this.notifyConfigChange(masjidId, masjid.config);
    return masjid.config;
  }

  async listAnnouncements(masjidId: string): Promise<Announcement[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.announcements ?? [];
  }

  async listEvents(masjidId: string): Promise<MasjidEvent[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.events ?? [];
  }

  async listDonations(masjidId: string): Promise<DonationCampaign[]> {
    const masjid = this.store.masjids[masjidId];
    return masjid?.donations ?? [];
  }

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
