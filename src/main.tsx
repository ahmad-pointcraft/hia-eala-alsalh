import { createRoot } from "react-dom/client";
import ThemeProviderWrapper from "./app/theme/ThemeProviderWrapper";
import App from "./app/App";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error(
    "Root element not found. Ensure index.html contains <div id=\"root\"></div>."
  );
}

createRoot(rootElement).render(
  <ThemeProviderWrapper>
    <App />
  </ThemeProviderWrapper>
);
