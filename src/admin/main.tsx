import { createRoot } from 'react-dom/client';
import { AdminApp } from './AdminApp';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure admin/index.html contains <div id="root"></div>.');
}

async function bootstrap(root: HTMLElement) {
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK === 'true') {
    const { worker } = await import('@/shared/api/mock/browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
      },
    });
  }
  createRoot(root).render(<AdminApp />);
}

void bootstrap(rootElement);
