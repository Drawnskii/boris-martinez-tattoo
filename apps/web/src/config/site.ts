export const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');
export const R2_URL = import.meta.env.PUBLIC_R2_URL.replace(/\/$/, '');

/* Canonical production origin — used for the canonical tag, OG/Twitter
   images, and the JSON-LD entity id. Matches the PUBLIC_ASTRO_SITE value
   set in the deploy pipeline. */
export const SITE_URL = 'https://borismartinez.ink';

export const SITE = {
  name: 'Boris Martínez',
  title: 'Boris Martínez — Black & Grey Tattoo Artist in Nolita & SoHo, NYC',
  description: 'Boris Martínez, custom black & grey tattoo artist at Blindreason Tattoo in Nolita, next to SoHo, NYC. Micro-realism and fine line by appointment only.',
} as const;

export type Site = typeof SITE;

/* -----------------------------------------------------------------
   Navbar layout — controlled by the PUBLIC_NAV_LAYOUT env variable.

     PUBLIC_NAV_LAYOUT=header  → sticky top header (default)
     PUBLIC_NAV_LAYOUT=left    → fixed left sidebar on desktop
     PUBLIC_NAV_LAYOUT=right   → fixed right sidebar on desktop

   Sidebar layouts fall back to a top header on mobile.

   PUBLIC_* variables are inlined at build time (Astro/Vite), so the
   flag must be set before `pnpm dev` / `pnpm build`.
   ----------------------------------------------------------------- */
export type NavLayout = 'header' | 'left' | 'right';

const rawLayout = import.meta.env.PUBLIC_NAV_LAYOUT;

export const NAV_LAYOUT: NavLayout =
  rawLayout === 'left' || rawLayout === 'right' ? rawLayout : 'header';

/* Content offset classes paired with the sidebar layouts. The layout
   applies these to the page-content wrapper so the sidebar doesn't
   overlap content on lg+ screens. */
export const NAV_CONTENT_OFFSET: Record<NavLayout, string> = {
  header: '',
  left: 'lg:pl-56',
  right: 'lg:pr-56',
};

/* -----------------------------------------------------------------
   Primary navigation. Anchors point at home-page sections; full
   pages (gallery, about) use real routes.
   ----------------------------------------------------------------- */
export const NAV_LINKS = [
  { href: '/#portfolio', label: 'Portfolio', title: 'Tattoo portfolio — the register of struck pieces' },
  { href: '/#about', label: 'About', title: 'About the artist and the house — Boris Martínez Tattoo' },
  // { href: '/#pricing', label: 'Pricing', title: 'Commission classes and pricing at the house' },
  { href: '/#health', label: 'Health & Care', title: 'Health, hygiene and tattoo aftercare instructions' },
  { href: '/#location', label: 'Location', title: 'Atelier location, sitting hours and contact' },
] as const;

/* -----------------------------------------------------------------
   Social links — one entry per profile, icon name matches a file in
   src/icons/. Add a new entry + an SVG file to scale this list.
   ----------------------------------------------------------------- */
export const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/borismartinez__/', icon: 'instagram' },
  { id: 'threads', label: 'Threads', url: 'https://www.threads.com/@borismartinez__/', icon: 'threads' },
] as const;

/* -----------------------------------------------------------------
   Site developer credit — shown in the footer's colophon line.
   ----------------------------------------------------------------- */
export const DEVELOPER = {
  name: 'Fernando Beltrán',
  url: 'https://www.linkedin.com/in/ferbeltrandev',
} as const;
