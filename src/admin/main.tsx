import { createRoot } from 'react-dom/client';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found. Ensure admin/index.html contains <div id="root"></div>.');
}

createRoot(rootElement).render(<div>Admin placeholder — built in Phase 3</div>);
