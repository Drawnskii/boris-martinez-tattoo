// @ts-check
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

/* astro.config runs before Astro injects .env into process.env, so read
   it here — otherwise the R2 host never lands in the image allowlist and
   every portfolio image ships unoptimized. Dependency-free on purpose:
   `vite` is not linked into this workspace package. */
const readEnvFile = (/** @type {string} */ file) => {
  try {
    return Object.fromEntries(
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^["']|["']$/g, '')];
        }),
    );
  } catch {
    return {};
  }
};

const env = { ...readEnvFile('.env'), ...readEnvFile('.env.local'), ...process.env };
const r2Url = env.PUBLIC_R2_URL || '';
const r2Domain = r2Url ? new URL(r2Url).hostname : '';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_ASTRO_SITE || 'http://localhost:4321',
  base: process.env.PUBLIC_ASTRO_BASE || '/',
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['maplibre-gl'],
    },
    build: {
      sourcemap: true,
    },
  },
  integrations: [
    icon(),
  ],
  image: {
    remotePatterns: [
      ...(r2Domain ? [{ protocol: 'https', hostname: r2Domain }] : []),
      { protocol: 'https', hostname: '**.r2.dev' },
    ],
  }
});
