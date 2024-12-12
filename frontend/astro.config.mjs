import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '../.env' : '../.env.development';
dotenv.config({ path: resolve(dirname(fileURLToPath(import.meta.url)), envFile) });

console.log('PUBLIC_API:', process.env.PUBLIC_API);

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind()],
  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.PUBLIC_API,
          secure: false,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('origin', process.env.PUBLIC_API);
            });
          },
        }
      }
    }
  }
});