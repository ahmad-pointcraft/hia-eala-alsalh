import { createRoot } from 'react-dom/client';
import ThemeProviderWrapper from './display/theme/ThemeProviderWrapper';
import { ErrorBoundary } from './display/components/shared';
import { PairingGate } from './display/PairingGate';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root"></div>.');
}

async function bootstrap(root: HTMLElement) {
  if (import.meta.env.DEV && import.meta.env.VITE_MOCK === 'true') {
    const { worker } = await import('./shared/api/mock/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  }

  createRoot(root).render(
    <ThemeProviderWrapper>
      <ErrorBoundary>
        <PairingGate />
      </ErrorBoundary>
    </ThemeProviderWrapper>,
  );
}

void bootstrap(rootElement);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[SW] Registration failed:', err);
    });
  });
}
