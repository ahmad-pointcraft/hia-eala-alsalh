import { http, HttpResponse } from 'msw';
import { DEMO_MASJID_ID, createInitialStore } from './seed';
import { generateId } from '@/shared/utils';

// NOTE (Spec 015): This REST surface is STAGED for the Real adapter (Spec 017).
// In dev the app talks to MockApiClient directly (it implements ApiClient on an
// in-memory + localStorage store — no fetch), so these handlers are not on the
// functional mock path. Content write ops (create/update/delete/reorder/images)
// are therefore NOT mirrored here — duplicating them would be dead code (Article IV)
// operating on a disconnected store. They will become live when RealApiClient
// performs real fetches and MSW intercepts them in dev.

const store = createInitialStore();

export const handlers = [
  http.get('/api/auth/session', () => HttpResponse.json(null)),
  http.post('/api/auth/signin', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };
    return HttpResponse.json({
      user: { id: 'user-mock', email },
      masjidId: DEMO_MASJID_ID,
      token: 'mock-token',
    });
  }),
  http.post('/api/auth/signout', () => HttpResponse.json({ ok: true })),
  http.get('/api/devices', () => HttpResponse.json(Object.values(store.devices))),
  http.post('/api/devices/register', () =>
    HttpResponse.json({
      deviceId: generateId('device'),
      pairingCode: String(Math.floor(100000 + Math.random() * 900000)),
      expiresAt: Date.now() + 10 * 60 * 1000,
    }),
  ),
  http.post('/api/devices/pair', async ({ request }) => {
    const { pairingCode } = (await request.json()) as { pairingCode: string };
    void pairingCode;
    return HttpResponse.json({
      device: { id: 'device-mock', masjidId: DEMO_MASJID_ID, name: 'Paired TV', status: 'paired' as const, lastSeenAt: Date.now() },
      masjid: { id: DEMO_MASJID_ID, name_en: store.masjids[DEMO_MASJID_ID]?.config.masjidName_en ?? 'Masjid', name_ar: store.masjids[DEMO_MASJID_ID]?.config.masjidName_ar ?? '' },
    });
  }),
  http.get('/api/masjids/:id/config', () => HttpResponse.json(store.masjids[DEMO_MASJID_ID]?.config ?? {})),
  http.get('/api/masjids/:id/announcements', () => HttpResponse.json(store.masjids[DEMO_MASJID_ID]?.announcements ?? [])),
  http.get('/api/masjids/:id/events', () => HttpResponse.json(store.masjids[DEMO_MASJID_ID]?.events ?? [])),
  http.get('/api/masjids/:id/donations', () => HttpResponse.json(store.masjids[DEMO_MASJID_ID]?.donations ?? [])),
];
