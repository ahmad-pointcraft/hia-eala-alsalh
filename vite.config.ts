import { defineConfig, type Plugin } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

function mpaDevPlugin(): Plugin {
  return {
    name: 'vite-plugin-mpa-dev',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url) {
          const url = req.url;
          if (
            url.startsWith('/admin') ||
            url.startsWith('/hia-eala-alsalh/admin')
          ) {
            if (!path.extname(url.split('?')[0])) {
              req.url = '/hia-eala-alsalh/admin/index.html';
            }
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  base: '/hia-eala-alsalh/',
  plugins: [react(), mpaDevPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    rollupOptions: {
      input: {
        display: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin/index.html'),
      },
    },
  },
});
