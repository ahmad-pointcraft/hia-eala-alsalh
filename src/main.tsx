import { createRoot } from 'react-dom/client';
import ThemeProviderWrapper from './display/theme/ThemeProviderWrapper';
import { ErrorBoundary } from './display/components/shared';
import App from './display/App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure index.html contains <div id="root"></div>.');
}

createRoot(rootElement).render(
  <ThemeProviderWrapper>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProviderWrapper>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('[SW] Registration failed:', err);
    });
  });
}
