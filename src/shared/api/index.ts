import type { ApiClient } from './contract';
import { MockApiClient } from './mock/MockApiClient';
import { RealApiClient } from './real/RealApiClient';

export type * from './contract';
export type * from './types';
export { MockApiClient, RealApiClient };

export function createApiClient(): ApiClient {
  const adapter = import.meta.env.VITE_API_ADAPTER ?? 'mock';
  return adapter === 'real' ? new RealApiClient() : new MockApiClient();
}

export const api: ApiClient = createApiClient();
