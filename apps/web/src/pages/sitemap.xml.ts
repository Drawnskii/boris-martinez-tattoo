import type { APIRoute } from 'astro';
import { BASE_URL } from '@config/site';

// Static pages discovered from the filesystem — works in dev and build,
// unlike a build-only sitemap integration. Excludes 404, private
// (underscore-prefixed), and dynamic (bracket) routes.
const pages = Object.keys(import.meta.glob('./**/*.astro'))
  .filter((file) => !/(^|\/)(404|_)/.test(file) && !file.includes('['))
  .map((file) => {
    const route = file.replace(/^\.\//, '').replace(/\.astro$/, '');
    return route === 'index' ? '' : `${route.replace(/\/index$/, '')}/`;
  })
  .sort((a, b) => (a === '' ? -1 : b === '' ? 1 : a.localeCompare(b)));

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const url = (path = '/') => new URL(`${BASE_URL}${path}`, origin).href;

  const entries = pages.map((path) => `  <url><loc>${url(`/${path}`)}</loc></url>`).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
