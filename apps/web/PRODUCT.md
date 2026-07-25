# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective tattoo clients. They arrive considering whether to commission a custom piece from Boris, and their job is to evaluate fit, view past work, read the artist's story, and reach the point of requesting a session. The portfolio must also read well to industry peers and press, but the booking client is the priority audience.

## Product Purpose

The public site for Boris Martinez, a tattoo artist. It exists to present Boris's work, story, and working footprint convincingly enough that a serious prospective client requests a commission. Success means a visitor books a session request.

## Positioning

Boris is a multi-city artist working across **Los Angeles · New Jersey · New York** — a traveling / guest-spot tattoo artist rather than a single fixed studio. That footprint is the position a neighboring single-shop tattoo site could not truthfully copy.

## Operating Context

- Appointments only — no walk-in pricing or instant booking. Every commission starts as a consultation request.
- Custom-only work: each design is built with the client during consultation, refined on paper, then taken to skin. There is no flash wall and the portfolio is a register of past work, not a menu.
- Boris's origin is documented fact: apprenticeship at **Kustom Kulture Tattoo Studio** (https://kktstudiola.com/), mentored by Nacho, Jade, Nancy, Ivan, Edison, and Andrew.

## Capabilities and Constraints

- The web app (`apps/web`, package `@boris-martinez-tattoo/web`) is a **fully static Astro + Tailwind v4 site**. No server endpoints live in the web app.
- A backend is planned as `apps/api` for booking/contact form handling; the booking request form is a static placeholder until that backend exists and must not fake a success state.
- The repository uses a layered architecture (Presentation → Application → Domain ← Infrastructure); the application/domain/infrastructure layers are currently `.gitkeep` stubs awaiting the backend.

## Brand Commitments

- Public brand: **Boris Martinez Tattoo**. Workspace scope is `@boris-martinez-tattoo/`.
- The committed visual world is "The Assay Catalog" — every tattoo treated as a hallmarked one-of-one piece entered in a register. Full visual rules are owned by `DESIGN.md` (not yet written).

## Evidence on Hand

- **No real visual assets exist yet.** All imagery is `ImagePlaceholder` stubs. Real photos and artwork will be supplied by Boris; never fabricate tattoo photos, client testimonials, press quotes, or case studies.
- The artist's biography copy for the home About section and the full `/about` page is confirmed and placed in `apps/web/src/components/sections/About.astro` and `apps/web/src/pages/about.astro`.
- The footer working-footprint string `Los Angeles · New Jersey · New York` and the hero tagline "I'm a Tattoo Artist who provides high quality work, bringing unique designs onto living canvas." are confirmed copy.

## Product Principles

1. **The register is the brand.** Past work is presented as a hallmarked register of one-of-one pieces, never as a flash menu or a generic grid.
2. **Custom-only, by appointment.** Every commission begins as a conversation; the site must never imply pick-from-the-wall pricing or instant booking.
3. **Multi-city, single artist.** Boris's LA·NJ·NY footprint is foregrounded — the artist travels, there are no branch studios.
4. **No fabricated evidence.** Until real photos, testimonials, or press arrive from Boris, placeholders hold the space; the site never ships invented proof.
5. **Static now, backend later.** The web app stays fully static; server-dependent features (form handling, persistent storage) are deferred to `apps/api` and surfaced honestly as not-yet-wired.