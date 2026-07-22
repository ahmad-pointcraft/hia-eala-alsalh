import type { MosqueConfig } from '@/display/types/mosqueConfig';

const DEVICE_TOKEN_KEY = 'hia-device-token';
const CACHED_CONFIG_KEY = 'hia-cached-config';

export interface DeviceToken {
  deviceId: string;
  masjidId: string;
  pairedAt: number;
}

export function getDeviceToken(): DeviceToken | null {
  try {
    const raw = localStorage.getItem(DEVICE_TOKEN_KEY);
    return raw ? (JSON.parse(raw) as DeviceToken) : null;
  } catch {
    return null;
  }
}

export function setDeviceToken(token: DeviceToken): void {
  localStorage.setItem(DEVICE_TOKEN_KEY, JSON.stringify(token));
}

export function clearDeviceToken(): void {
  localStorage.removeItem(DEVICE_TOKEN_KEY);
}

interface CachedConfig {
  config: MosqueConfig;
  at: number;
}

export function getCachedConfig(): CachedConfig | null {
  try {
    const raw = localStorage.getItem(CACHED_CONFIG_KEY);
    return raw ? (JSON.parse(raw) as CachedConfig) : null;
  } catch {
    return null;
  }
}

export function setCachedConfig(config: MosqueConfig): void {
  const cached: CachedConfig = { config, at: Date.now() };
  localStorage.setItem(CACHED_CONFIG_KEY, JSON.stringify(cached));
}
