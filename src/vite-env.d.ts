/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_ADAPTER?: 'mock' | 'real';
  readonly VITE_MOCK?: string;
  readonly VITE_DISPLAY_APP_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
