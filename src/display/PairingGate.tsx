import { useState, useEffect, useRef } from 'react';
import { api } from '@/shared/api';
import { useMosqueConfigStore } from '@/display/store';
import { cacheStore } from '@/display/services';
import {
  getDeviceToken,
  setDeviceToken,
  clearDeviceToken,
  getCachedConfig,
  setCachedConfig,
  DEVICE_TOKEN_STORAGE_KEY,
  type DeviceToken,
} from '@/display/utils';
import { PairingCodeScreen } from '@/display/components/PairingCodeScreen';
import App from '@/display/App';

type Phase = 'unpaired' | 'pairing' | 'content' | 'offline';

const POLL_INTERVAL_MS = 3000;
const CODE_TTL_MS = 10 * 60 * 1000;
const OFFLINE_RETRY_MS = 10_000;

export function PairingGate() {
  const [phase, setPhase] = useState<Phase>('unpaired');
  const [code, setCode] = useState<string | null>(null);
  const setConfig = useMosqueConfigStore((s) => s.setConfig);
  const setMasjidId = useMosqueConfigStore((s) => s.setMasjidId);

  const phaseRef = useRef<Phase>('unpaired');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const regenRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);
  const mountedRef = useRef(true);
  // TOKEN GUARD - prevents stale timers
  const startRunRef = useRef(0);

  function updatePhase(p: Phase) {
    phaseRef.current = p;
    setPhase(p);
  }

  function clearTimers() {
    if (pollRef.current) clearInterval(pollRef.current);
    if (regenRef.current) clearTimeout(regenRef.current);
    if (retryRef.current) clearTimeout(retryRef.current);
    if (unsubRef.current) unsubRef.current();
    pollRef.current = null;
    regenRef.current = null;
    retryRef.current = null;
    unsubRef.current = null;
  }

  useEffect(() => {
    mountedRef.current = true;
    const token = getDeviceToken();
    if (token) {
      void validateAndLoad(token);
    } else {
      void startPairing();
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key !== DEVICE_TOKEN_STORAGE_KEY && e.key !== null) return;
      const currentToken = getDeviceToken();
      if (currentToken) {
        void validateAndLoad(currentToken);
      } else if (phaseRef.current === 'content' || phaseRef.current === 'offline') {
        void startPairing();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('storage', handleStorageChange);
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function validateAndLoad(token: DeviceToken) {
    try {
      const status = await api.getDeviceStatus(token.deviceId);
      if (!status.paired) {
        clearDeviceToken();
        if (mountedRef.current) {
          void startPairing();
        }
        return;
      }
      void loadContent(token.masjidId);
    } catch {
      // Network/offline error fallback
      void loadContent(token.masjidId);
    }
  }

  async function startPairing() {
    // ALWAYS START FROM A CLEAN SLATE — no leaked intervals from a previous run
    const runId = ++startRunRef.current;
    clearTimers();
    try {
      const result = await api.registerDevice();
      if (!mountedRef.current || runId !== startRunRef.current) return;
      setCode(result.pairingCode);
      updatePhase('pairing');

      const pollId = setInterval(async () => {
        // SUPERSEDED BY A NEWER RUN — stop this poll loop entirely
        if (!mountedRef.current || runId !== startRunRef.current) {
          clearInterval(pollId);
          return;
        }
        try {
          const status = await api.getDeviceStatus(result.deviceId);
          if (
            status.paired &&
            status.masjidId &&
            mountedRef.current &&
            runId === startRunRef.current
          ) {
            clearInterval(pollId);
            if (pollRef.current === pollId) pollRef.current = null;
            setDeviceToken({
              deviceId: result.deviceId,
              masjidId: status.masjidId,
              pairedAt: Date.now(),
            });
            setMasjidId(status.masjidId);
            void loadContent(status.masjidId);
          }
        } catch {
          /* keep polling */
        }
      }, POLL_INTERVAL_MS);
      pollRef.current = pollId;

      regenRef.current = setTimeout(() => {
        if (
          mountedRef.current &&
          runId === startRunRef.current &&
          (phaseRef.current === 'unpaired' || phaseRef.current === 'pairing')
        ) {
          void startPairing();
        }
      }, CODE_TTL_MS);
    } catch {
      if (!mountedRef.current || runId !== startRunRef.current) return;
      retryRef.current = setTimeout(() => {
        if (mountedRef.current && runId === startRunRef.current) void startPairing();
      }, OFFLINE_RETRY_MS);
    }
  }

  async function loadContent(masjidId: string) {
    try {
      const config = await api.getMasjidConfig(masjidId);
      if (!mountedRef.current) return;
      setConfig(config);
      setMasjidId(masjidId);
      setCachedConfig(config);
      updatePhase('content');

      // ATOMIC SUBSCRIPTION SWAP — subscribe first, THEN drop the old
      // subscription. Unsubscribing before the await would leave a window
      // with zero subscribers, and realtime writes in that window would
      // never invalidate the display caches (stale until refresh).
      const nextUnsub = api.subscribe(masjidId, {
        onConfigChange: async (cfg) => {
          if (mountedRef.current) {
            const token = getDeviceToken();
            if (token) {
              try {
                const status = await api.getDeviceStatus(token.deviceId);
                if (!status.paired) {
                  clearDeviceToken();
                  void startPairing();
                  return;
                }
              } catch {
                /* retain content if status check fails */
              }
            }
            setConfig(cfg);
            setCachedConfig(cfg);
          }
        },
        onContentChange: (payload) => {
          if (payload.announcements) cacheStore.invalidate(`announcements-${masjidId}`);
          if (payload.events) cacheStore.invalidate(`events-${masjidId}`);
          if (payload.donations) cacheStore.invalidate(`donations-${masjidId}`);
          if (payload.carouselImages) cacheStore.invalidate(`images-carousel-${masjidId}`);
        },
      });

      const previousUnsub = unsubRef.current;
      unsubRef.current = nextUnsub;
      previousUnsub?.();
    } catch {
      const cached = getCachedConfig();
      if (cached && mountedRef.current) {
        setConfig(cached.config);
        updatePhase('offline');
      }
      retryRef.current = setTimeout(() => {
        if (mountedRef.current) void loadContent(masjidId);
      }, OFFLINE_RETRY_MS);
    }
  }

  if (phase === 'unpaired' || phase === 'pairing') {
    return <PairingCodeScreen code={code} />;
  }

  return <App />;
}
