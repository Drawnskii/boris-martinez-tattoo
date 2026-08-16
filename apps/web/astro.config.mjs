// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';

const r2Domain = process.env.PUBLIC_R2_URL 
  ? new URL(process.env.PUBLIC_R2_URL).hostname 
  : '';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_ASTRO_SITE || 'http://localhost:4321',
  base: process.env.PUBLIC_ASTRO_BASE || '/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    icon(),
  ],
  image: {
    domains: r2Domain ? [r2Domain] : [],
  }
});