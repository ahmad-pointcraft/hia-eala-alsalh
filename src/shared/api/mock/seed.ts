import { DEFAULT_MOSQUE_CONFIG, type MosqueConfig } from '@/shared/types';
import type { Device, Announcement, MasjidEvent, DonationCampaign, StoredImage, Session, ContentChangePayload } from '../types';

export const DEMO_MASJID_ID = 'masjid-demo-1';

export interface MasjidData {
  config: MosqueConfig;
  announcements: Announcement[];
  events: MasjidEvent[];
  donations: DonationCampaign[];
  images: StoredImage[];
}

export interface MockStore {
  masjids: Record<string, MasjidData>;
  devices: Record<string, Device>;
  pairingCodes: Record<string, { deviceId: string; expiresAt: number }>;
  sessions: Record<string, { session: Session; masjidId: string }>;
  realtimeSubscribers: Set<{
    masjidId: string;
    handlers: {
      onConfigChange: (cfg: MosqueConfig) => void;
      onContentChange: (p: ContentChangePayload) => void;
    };
  }>;
}

export function createInitialStore(): MockStore {
  const config: MosqueConfig = {
    ...DEFAULT_MOSQUE_CONFIG,
    masjidName_en: 'Masjid Al-Noor',
    masjidName_ar: '\u0645\u0633\u062C\u062F \u0627\u0644\u0646\u0648\u0631',
  };

  const now = Date.now();

  const devices: Record<string, Device> = {
    'device-1': {
      id: 'device-1',
      masjidId: DEMO_MASJID_ID,
      name: 'Main Hall TV',
      status: 'paired',
      lastSeenAt: now,
    },
    'device-2': {
      id: 'device-2',
      masjidId: DEMO_MASJID_ID,
      name: 'Prayer Hall TV',
      status: 'paired',
      lastSeenAt: now,
    },
  };

  return {
    masjids: {
      [DEMO_MASJID_ID]: {
        config,
        announcements: [
          {
            id: 'ann-1',
            masjidId: DEMO_MASJID_ID,
            text_en: 'Friday prayer at 1:15 PM',
            text_ar:
              '\u0635\u0644\u0627\u0629 \u0627\u0644\u062C\u0645\u0639\u0629 \u0627\u0644\u0633\u0627\u0639\u0629 1:15',
            active: true,
            order: 0,
          },
          {
            id: 'ann-2',
            masjidId: DEMO_MASJID_ID,
            text_en: 'Quran classes every Saturday',
            text_ar:
              '\u062D\u0644\u0642\u0627\u062A \u0627\u0644\u0642\u0631\u0622\u0646 \u0643\u0644 \u0633\u0628\u062A',
            active: true,
            order: 1,
          },
        ],
        events: [
          {
            id: 'evt-1',
            masjidId: DEMO_MASJID_ID,
            badge_en: 'Community',
            badge_ar: '\u0645\u062C\u062A\u0645\u0639\u064A',
            title_en: 'Community Iftar',
            title_ar: '\u0625\u0641\u0637\u0627\u0631 \u062C\u0645\u0627\u0639\u064A',
            speaker_en: 'Imam Ahmad',
            speaker_ar: '\u0627\u0644\u0625\u0645\u0627\u0645 \u0623\u062D\u0645\u062F',
            date: '2026-09-15',
            time: '18:30',
            location_en: 'Main Hall',
            location_ar: '\u0627\u0644\u0642\u0627\u0639\u0629 \u0627\u0644\u0631\u0626\u064A\u0633\u064A\u0629',
            cta_en: 'Join us',
            cta_ar: '\u0627\u0646\u0636\u0645 \u0625\u0644\u064A\u0646\u0627',
            imageUrl: null,
            active: true,
          },
        ],
        donations: [
          {
            id: 'don-1',
            masjidId: DEMO_MASJID_ID,
            title_en: 'Ramadan Expansion',
            title_ar: '\u062A\u0648\u0633\u0639\u0629 \u0631\u0645\u0636\u0627\u0646',
            description_en: 'Help us expand our prayer hall to accommodate the growing community during Ramadan and beyond.',
            description_ar: '\u0633\u0627\u0639\u062F\u0646\u0627 \u0641\u064A \u062A\u0648\u0633\u0639\u0629 \u0642\u0627\u0639\u0629 \u0627\u0644\u0635\u0644\u0627\u0629 \u0644\u0627\u0633\u062A\u064A\u0639\u0627\u0628 \u0627\u0644\u0645\u062C\u062A\u0645\u0639 \u0627\u0644\u0645\u062A\u0646\u0627\u0645\u064A \u062E\u0644\u0627\u0644 \u0631\u0645\u0636\u0627\u0646 \u0648\u0645\u0627 \u0628\u0639\u062F\u0647.',
            collected: 87500,
            goal: 120000,
            donorCount: 142,
            donateUrl: 'https://donate.examplemasjid.org',
            qrImageUrl: null,
            active: true,
          },
        ],
        images: [],
      },
    },
    devices,
    pairingCodes: {},
    sessions: {},
    realtimeSubscribers: new Set(),
  };
}

export const STORAGE_KEY = 'hia-mock-store';

export function loadStore(): MockStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<MockStore>;
      return {
        ...createInitialStore(),
        ...parsed,
        realtimeSubscribers: new Set(),
      };
    }
  } catch {
    // fall through to fresh store
  }
  return createInitialStore();
}

export function saveStore(store: MockStore): void {
  try {
    const { realtimeSubscribers, ...persistable } = store;
    void realtimeSubscribers;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
  } catch {
    // localStorage might be unavailable (private mode) — non-fatal
  }
}
