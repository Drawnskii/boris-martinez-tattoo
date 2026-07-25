// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_ASTRO_SITE || 'http://localhost:4321',
  base: process.env.PUBLIC_ASTRO_BASE || '/',
  vite: {
    plugins: [tailwindcss()],
  },
});