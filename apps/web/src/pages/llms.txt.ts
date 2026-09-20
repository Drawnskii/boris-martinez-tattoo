import type { APIRoute } from 'astro';
import { BASE_URL, SOCIAL_LINKS } from '@config/site';

// llms.txt — LLM-friendly overview of the site (https://llmstxt.org, v2).
// Curated entry point for agents: business facts, then links to pages.
export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const url = (path = '/') => new URL(`${BASE_URL}${path}`, origin).href;

  const socials = SOCIAL_LINKS.map((social) => `- [${social.label}](${social.url})`).join('\n');

  const body = `# Boris Martínez Tattoo

> Boris Martínez is a custom black & grey tattoo artist working across Los Angeles, New York, and New Jersey, with an appointment-only atelier at 258 Elizabeth St, New York, NY 10012. The site is the studio's register: portfolio, artist story, commission pricing, health & aftercare, location, and booking.

Key facts:

- Artist: Boris Martínez — custom black & grey, blackwork, and liquid-metal tattoo work.
- Atelier: 258 Elizabeth St, New York, NY 10012, USA. By appointment only.
- Sitting hours: Monday–Friday 10:00–19:00; Saturday 11:00–17:00; Sunday closed.
- Contact: +1 (818) 351-6420 · Martínezzboris@gmail.com · Instagram and Threads @borisMartínez__.
- Pricing: Class I (small pieces, up to roughly 2 x 2 in) $150 flat; Class II (medium pieces, up to roughly 6 in) $500–$600; Class III (large and fully custom) by quotation.
- Booking: request a consultation through the site form; the studio replies within 24–48 hours. A deposit confirms every sitting and is deducted from the final price.

## Pages

- [Home](${url('/')}): hero, most recent portfolio entries, artist summary, pricing, health & aftercare, location, and the booking form.
- [The Artist](${url('/about/')}): Boris Martínez's story — the move to Los Angeles, the apprenticeship at Kustom Kulture Tattoo Studio, and the path to custom black & grey work.
- [The Register — gallery](${url('/gallery/')}): the full portfolio, every piece entered with its assay mark (serial, placement, category).

## Home sections

- [Portfolio](${url('/#portfolio')}): the six most recent pieces; the full register lives on the gallery page.
- [Pricing](${url('/#pricing')}): the three commission classes with published rates.
- [Health & Care](${url('/#health')}): before-appointment, health-condition, and aftercare guidance.
- [Location](${url('/#location')}): address, sitting hours, contact details, and map.
- [Booking](${url('/#booking')}): the commission request form.

## Optional

${socials}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
