import type { ApiClient } from './contract';
import { createMockApiClient } from './mock/MockApiClient';
import { createRealApiClient } from './real/RealApiClient';

export type * from './contract';
export type * from './types';
export { createMockApiClient, createRealApiClient };

export function createApiClient(): ApiClient {
  const adapter = import.meta.env.VITE_API_ADAPTER ?? 'mock';
  return adapter === 'real' ? createRealApiClient() : createMockApiClient();
}

// SINGLETON — factory closures yield stable bound references; detached
// usage (`list: api.listAnnouncements`) is safe by construction.
export const api: ApiClient = createApiClient();
