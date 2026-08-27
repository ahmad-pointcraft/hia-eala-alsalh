import { z } from 'zod';
import { mosqueConfigSchema } from '@/shared/types/schema';

const DEVICE_TOKEN_KEY = 'hia-device-token';
const CACHED_CONFIG_KEY = 'hia-cached-config';

/** localStorage key for the pairing token — exported so cross-tab storage
 * listeners can filter for exactly this write. */
export const DEVICE_TOKEN_STORAGE_KEY = DEVICE_TOKEN_KEY;

const deviceTokenSchema = z.object({
  deviceId: z.string(),
  masjidId: z.string(),
  pairedAt: z.number(),
});

export type DeviceToken = z.infer<typeof deviceTokenSchema>;

export function getDeviceToken(): DeviceToken | null {
  try {
    const raw = localStorage.getItem(DEVICE_TOKEN_KEY);
    return raw ? deviceTokenSchema.parse(JSON.parse(raw)) : null;
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

const cachedConfigSchema = z.object({
  config: mosqueConfigSchema,
  at: z.number(),
});

type CachedConfig = z.infer<typeof cachedConfigSchema>;

export function getCachedConfig(): CachedConfig | null {
  try {
    const raw = localStorage.getItem(CACHED_CONFIG_KEY);
    return raw ? cachedConfigSchema.parse(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function setCachedConfig(config: z.infer<typeof mosqueConfigSchema>): void {
  const cached: CachedConfig = { config, at: Date.now() };
  localStorage.setItem(CACHED_CONFIG_KEY, JSON.stringify(cached));
}
