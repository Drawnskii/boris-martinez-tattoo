export const BASE_URL = import.meta.env.BASE_URL.replace(/\/$/, '');

export const SITE = {
  name: 'Boris Martinez',
  title: 'Boris Martinez — Blackwork Tattoos in LA, NY & NJ',
  description: 'Boris Martinez official portfolio. Custom blackwork tattoo artist serving Los Angeles, New York, and New Jersey.',
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
  { href: '/#about', label: 'About', title: 'About the artist and the house — Boris Martinez Tattoo' },
  { href: '/#pricing', label: 'Pricing', title: 'Commission classes and pricing at the house' },
  { href: '/#health', label: 'Health & Care', title: 'Health, hygiene and tattoo aftercare instructions' },
  { href: '/#location', label: 'Location', title: 'Atelier location, sitting hours and contact' },
] as const;
