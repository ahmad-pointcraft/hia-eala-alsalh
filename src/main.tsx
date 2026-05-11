import { createRoot } from "react-dom/client";
import ThemeProviderWrapper from "./app/theme/ThemeProviderWrapper";
import { ErrorBoundary } from "./app/components/ErrorBoundary";
import App from "./app/App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure index.html contains <div id=\"root\"></div>."
  );
}

createRoot(rootElement).render(
  <ThemeProviderWrapper>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </ThemeProviderWrapper>
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
