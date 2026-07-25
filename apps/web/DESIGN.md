---
name: Boris Martinez Tattoo — The Assay Catalog
description: Matte graphite velvet ground, struck-silver inscriptions, beige paper only where a document or seal exists.
colors:
  graphite-velvet-950:
    value: "oklch(0.15 0.006 90)"
  graphite-velvet-900:
    value: "oklch(0.2 0.007 90)"
  graphite-velvet-800:
    value: "oklch(0.25 0.008 90)"
  graphite-velvet-700:
    value: "oklch(0.31 0.009 90)"
  struck-silver-100:
    value: "oklch(0.97 0.003 260)"
  struck-silver-400:
    value: "oklch(0.78 0.008 260)"
  certificate-beige-100:
    value: "oklch(0.94 0.025 90)"
  certificate-beige-300:
    value: "oklch(0.83 0.052 88)"
  certificate-beige-400:
    value: "oklch(0.76 0.065 85)"
  background:
    value: "{colors.graphite-velvet-950}"
  foreground:
    value: "{colors.struck-silver-100}"
  muted-foreground:
    value: "{colors.struck-silver-400}"
  border:
    value: "{colors.graphite-velvet-700}"
  ring:
    value: "{colors.certificate-beige-400}"
  raised:
    value: "{colors.graphite-velvet-900}"
  paper:
    value: "{colors.certificate-beige-100}"
  paper-foreground:
    value: "{colors.graphite-velvet-900}"
  accent:
    value: "{colors.certificate-beige-400}"
typography:
  display:
    fontFamily: '"Cinzel", "Trajan Pro", ui-serif, Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.5rem, 6.8vw, 2.5rem)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "0.02em"
  body:
    fontFamily: '"Archivo", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: '"JetBrains Mono", ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace'
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 0.875
    letterSpacing: "0.14em"
rounded:
  none: "0px"
  sm: "0.125rem"
  md: "0.25rem"
  lg: "0.5rem"
  full: "9999px"
spacing:
  shell-pad: "1.5rem"
  shell-max: "72rem"
components:
  button-primary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-foreground}"
    rounded: "{rounded.none}"
    padding: "0.875rem 2rem"
    typography:
      fontFamily: '"Cinzel", "Trajan Pro", ui-serif, Georgia, "Times New Roman", serif'
      fontSize: "0.75rem"
      fontWeight: 600
      letterSpacing: "0.12em"
      textTransform: "uppercase"
  button-primary-hover:
    backgroundColor: "{colors.certificate-beige-300}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0.875rem 2rem"
    typography:
      fontFamily: '"Cinzel", "Trajan Pro", ui-serif, Georgia, "Times New Roman", serif'
      fontSize: "0.75rem"
      fontWeight: 400
      letterSpacing: "0.12em"
      textTransform: "uppercase"
  button-outline-hover:
    textColor: "{colors.certificate-beige-300}"
  input-field:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0.875rem"
    typography:
      fontFamily: '"Archivo", ui-sans-serif, system-ui, sans-serif'
      fontSize: "0.875rem"
  input-field-focus:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.foreground}"
  nav-link:
    textColor: "{colors.muted-foreground}"
    typography:
      fontFamily: '"Cinzel", "Trajan Pro", ui-serif, Georgia, serif'
      fontSize: "0.75rem"
      fontWeight: 400
      letterSpacing: "0.14em"
      textTransform: "uppercase"
  nav-link-hover:
    textColor: "{colors.foreground}"
  card:
    backgroundColor: "{colors.background}"
    rounded: "{rounded.none}"
    padding: "1.5rem"
  assay-mark:
    textColor: "{colors.muted-foreground}"
    typography:
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
      fontSize: "0.625rem"
      fontWeight: 400
      letterSpacing: "0.14em"
      textTransform: "uppercase"
  assay-mark-sealed:
    backgroundColor: "transparent"
    textColor: "{colors.certificate-beige-300}"
    rounded: "{rounded.full}"
    padding: "0.375rem"
---

# Design System: Boris Martinez Tattoo — The Assay Catalog

## Overview

**Creative North Star: "The Assay Catalog"**

Every tattoo leaves this studio hallmarked like a piece of precious metal — entered in a register with its assay stamp (serial, placement, session date). The site is that register: a matte graphite velvet ground, engraved silver-white inscriptions, beige certificate paper reserved exclusively for documents, seals, and stamps. The metaphor refutes the category's default dark photo-grid + gothic type, replacing gothic mood with the precision of a silversmith's ledger.

The world is dark-dominant and quiet. The graphite ground owns the page; silver metal is every word; beige appears only where a physical artifact (a commission seal, a wax stamp, an assay hallmark, a paper slip) would be pressed onto the page. Sharp corners and hairline rules do the structural work that shadows and gradients would do in a softer system — the register is crisp, not soft. Cinzel carries the engraved display caps the way an inscription cutter would cut them; Archivo is the register's running hand; JetBrains Mono carries only functional registration data — serials, dates, sizes — never decoration.

Depth is tonal, not cast. Surfaces step one ramp-step darker or lighter on the graphite scale to distinguish background from raised, and a single hairline rule separates them. The one signature motion is the liquid-mercury drop in the hero — a WebGL noise-displaced chrome form that honors the studio's liquid-metal work — and it is one-of-a-kind: the rest of the system stays still.

**Key Characteristics:**
- Matte graphite velvet ground, dark-dominant, warm near-neutral cast.
- Struck-silver type as the single ink; beige reserved for documents, seals, and stamps (≤10% of any view).
- Sharp corners (0–2px); `rounded-full` only for the wax seal and the sealed assay mark.
- Hairline rules and tonal steps replace shadows and gradients.
- Cinzel for engraved display caps, Archivo for body, JetBrains Mono for assay data only.
- One signature motion: the liquid-mercury drop in the hero; everything else is static.

## Colors

The dark-dominant silversmith's register: a warm graphite ground, near-white metal type, and a beige certificate accent that appears only where a document or seal would be pressed onto the page.

### Primary
- **Graphite Velvet** (`oklch(0.15 0.006 90)` at 950, ramp to `oklch(0.96 0.005 90)` at 50): the dark page ground and every structural surface. Warm, near-neutral, hue ≈ 90. Semantic `background` is 950, `raised` is 900, `muted` is 800, `border` is 700.

### Secondary
- **Struck Silver** (`oklch(0.97 0.003 260)` at 100, ramp to `oklch(0.22 0.006 260)` at 950): all type and engraving — the only "ink" on the page. Hue ≈ 260, near-neutral. Semantic `foreground` is 100, `muted-foreground` is 400.

### Tertiary
- **Certificate Beige** (`oklch(0.94 0.025 90)` at 100, ramp to `oklch(0.27 0.038 70)` at 950): paper, wax, focus rings, and stamps only. Hue shifts 90 → 70 as it darkens. Semantic `paper` is 100, `ring` and `accent` are 400.

### Named Rules
**The Paper Rule.** Beige appears only where a physical document, seal, stamp, or hallmark would exist on the page — the primary button, the sealed assay mark, focus rings, the wax-seal nav medallion, the `::selection` highlight. It must never become a section background, a card fill, or a decorative accent. Cap its area at ~10% of any viewport; its rarity is the point.
**The Two-Ink Rule.** Silver type on graphite ground — never reverse (graphite type on silver) and never set body copy in beige. Beige is for stamps and marks, not paragraphs.

## Typography

**Display Font:** Cinzel (with "Trajan Pro", ui-serif, Georgia, "Times New Roman", serif)
**Body Font:** Archivo (with ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, "Cascadia Mono", "SFMono-Regular", Menlo, Consolas, monospace)

**Character:** An inscription cutter's caps paired with a register clerk's running hand, with a third functional mono voice reserved for assay data only. Cinzel cuts the way silver is struck — wide, weighted, slightly formal. Archivo is the neutral register hand that disappears into reading. JetBrains Mono carries serials, dates, and stamps and never decoration.

### Hierarchy
- **Display** (600, `clamp(1.5rem, 6.8vw, 2.5rem)` up to `text-7xl`, line-height 1.1, letter-spacing 0.02em–0.06em): Cinzel, uppercase. Hero h1, page h1, section h2, the assay-mark headings. Used engraved, never decorative.
- **Headline** (600, 1.875rem–2.25rem / 2.25rem–2.5rem): Cinzel. Sub-section h3 (card titles, tier names, chapter titles).
- **Title** (600, 1.25rem–1.5rem / 1.75rem–2rem): Cinzel. Small titles like the <code class="bg-raised px-1 font-mono text-sm">Address</code> / <code class="bg-raised px-1 font-mono text-sm">Sitting hours</code> ledger heads on Location.
- **Body** (400, 1rem / 1.5rem): Archivo. All paragraph copy. Wrap long-form to ~65ch; the <code class="bg-raised px-1 font-mono text-sm">.shell</code> and per-element <code class="bg-raised px-1 font-mono text-sm">max-w-[65ch]</code> utilities hold the line.
- **Label** (400, 0.625rem / 0.875rem, letter-spacing 0.14em–0.2em, uppercase): JetBrains Mono. Entry tags (<code class="bg-raised px-1 font-mono text-sm">Entry I — The Work</code>), assay marks (<code class="bg-raised px-1 font-mono text-sm">No. 042 · Forearm · 2026</code>), field labels, stamp text. Functional registration data only — never a decorative eyebrow.

### Named Rules
**The Chisel Rule.** Cinzel is for display and headings. Archivo is for body copy. JetBrains Mono is for assay serials, dates, sizes, and field labels only — never a decorative eyebrow, never a paragraph, never a button label. Mixing the three (e.g. mono for body, Cinzel for a label) breaks the metaphor.

## Layout

One site container, one measure. The `.shell` utility centers every site-level wrapper at `--shell-max: 72rem` with `--shell-pad: 1.5rem` of inline padding; the header bar, every section inner, the page main, and the footer all read the same two tokens, so retuning the site width is one line and alignment is automatic. Narrower surfaces (the About article at 48rem, the Booking slip at 48rem) override the token on the element, not the utility.

Home-page sections are each `min-h-svh` with `py-16 md:py-24`, stacked under hairline `border-y` rules; the visitor scrolls the register entry by entry. Internal two-column grids collapse to one column at the `md` breakpoint. Per-element line measures (`max-w-md`, `max-w-2xl`, `max-w-[65ch]`) govern readability, not site layout — they are independent of `.shell`.

The navbar has three layouts selected by `PUBLIC_NAV_LAYOUT`: a sticky top `header` (default), or a fixed `lg:` `left` / `right` sidebar that collapses to a sticky top header on mobile. Sidebars are `w-64`; the content offset (`lg:pl-64` / `lg:pr-64`) is applied on the page wrapper. The hero's gradient veil spans the viewport edge-to-edge while its text column rides the same `.shell` edges as every other section, so the heading aligns with the header and the sections below with no `calc()` anywhere.

Spacing rhythm follows Tailwind's `--spacing: 0.25rem` multiplier; breaks land on `gap-px` (hairline grids), `gap-6`, `gap-10`, and `py-16` / `py-24` for section rhythm.

## Elevation & Depth

The register is flat by default. Depth is conveyed tonally — surfaces step one ramp-step on the graphite scale (`background` 950 → `raised` 900 → `muted` 800) and are separated by 1px hairline `border-border` rules. Gradients appear only where they read as a physical consequence: the hero's left-to-right and bottom-up veil that dissolves the mercury drop into the page ground (not as decoration), and the figcaption gradient on portfolio entries that fades an assay stamp up out of the graphite.

### Shadow Vocabulary
- **State-only hover glow** (`box-shadow: 0 2px 8px rgba(0,0,0,0.4)`): appears only on `:hover` for the primary paper button and the booking submit. Never applied to a resting surface.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (hover, focus, elevation). No card shadows, no ambient elevation, no faux depth — tonal steps and hairline rules carry all structural separation.

## Shapes

Sharp corners are the register's form language: `--radius-none: 0px` for nearly every surface, `--radius-sm: 0.125rem` (2px) and `--radius-md: 0.25rem` (4px) available only where a hairline softening is unavoidable. `--radius-full: 9999px` is reserved for exactly two artifacts: the wax-seal nav medallion (`NavBrand`'s `<span>BM</span>`) and the sealed `AssayMark` stamp. No intermediate radii (`rounded-lg` / `rounded-xl` / `rounded-2xl`) are used on any resting surface. Borders are 1px hairlines in `border-border` (graphite 700) or `border-tertiary-400/70` (beige at 70% alpha) for the wax-seal rings.

## Components

### Buttons
- **Shape:** square corners (`--radius-none: 0px`); Cinzel caps; letter-spacing 0.12em; sized by the caller's `class` prop.
- **Primary (paper):** beige seal `bg-paper` (certificate beige 100), `text-paper-foreground` (graphite 900), 600 weight. Hover: `bg-tertiary-300` + `box-shadow: 0 2px 8px rgba(0,0,0,0.4)` (state-only, per Flat-By-Default). Used for the stamped, primary action — hero "Book Your Session", booking submit, top pricing tier, "Open the full register", "Read the artist's entry".
- **Outline (engraved):** transparent, `border border-border` (graphite 700), `text-foreground` (silver 100). Hover: `border-tertiary-400` (beige) + `text-tertiary-300`. Used for the engraved, secondary action — hero "See Work", back-to-home, lower pricing tiers.
- **Focus:** global `:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }` — beige focus ring, never the button's own shadow.

### Inputs / Fields
- **Style:** 1px `border-border`, `bg-raised` (graphite 900), `rounded-none`, `px-3.5 py-2.5`, Archivo `text-sm`.
- **Focus:** `border-tertiary-400` (beige), `outline-none` — the beige edge replaces the global focus ring so the field stays register-native.
- **Labels:** JetBrains Mono `text-2xs` uppercase tracking-[0.14em], `text-muted-foreground`, set with `mb-1.5 block` above the field.

### Navigation
- **Header (default):** sticky `top-0`, `h-16`, `bg-background/90 backdrop-blur`, `border-b border-border`. `NavBrand` (wax-seal medallion + Cinzel wordmark) left, links + compact `NavCta` right on `md+`.
- **Sidebar (left/right):** fixed `w-64`, full height, `border-r` / `border-l`, `bg-background`, `p-6`. `NavBrand` stacked compact, vertical link list, full `NavCta` at the foot, mono "Est. register open / By appointment only" stamp. Falls back to the header on mobile.
- **Links:** Cinzel `text-xs tracking-[0.14em] uppercase text-muted-foreground`; hover `text-foreground`. No underline, no active state styling.
- **Mobile toggle:** 1px-bordered square `size-10` hamburger; reveals an absolute `bg-background/95 backdrop-blur` panel below with the same links and the CTA.

### Cards / Containers
- **Corner Style:** sharp (`rounded-none`).
- **Background:** `bg-background` (or `bg-raised/50` for alternating sections like About and Health); separated by `gap-px` inside a `bg-border` grid so the hairlines read as the card edges.
- **Shadow Strategy:** none at rest (Flat-By-Default).
- **Border:** 1px `border-border`; portfolio cards change to `from-background via-background/80` gradient caption overlay instead of a bottom border.
- **Internal Padding:** `p-6` for health chapters and location panels; `p-4` for portfolio figcaptions; booking slip `p-6 md:p-10`.

### Signature Components
- **Wax Seal (NavBrand medallion):** `size-9` (header) / `size-10` (sidebar) circle, `rounded-full`, `border border-tertiary-400/70` (beige at 70% alpha), Cinzel `text-sm tracking-[0.05em] text-tertiary-300`, two-letter monogram "BM". One of only two `rounded-full` surfaces in the system.
- **AssayMark:** mono `text-2xs uppercase tracking-[0.14em]` stamp joining `serial · placement · session`. Unsealed variant sits in muted silver; `sealed` variant wraps the string in the same `rounded-full border-tertiary-400/70` wax circle as the NavBrand medallion. Carried by every registered piece.
- **Commission Slip (Booking form):** a paper-document metaphor inside the dark register — `border border-border bg-background p-6 md:p-10`, a mono header row ("Commission slip" / "Boris Martinez Tattoo") above a `border-b`, a `sm:grid-cols-2` field grid, and a `border-t pt-6` footer row with the primary paper button. Submit success is a mono `role="status"` line in `text-tertiary-300`; it must not appear until a real backend exists (the current handler is a placeholder).
- **Liquid-Mercury Drop (hero):** a single WebGL noise-displaced chrome plane rendered by `src/components/shaders/template-shader/`. Three.js is dynamically imported on idle so the ~600KB bundle never blocks FCP/LCP. Capped DPR (1.0 mobile, 1.25 desktop), pauses on `IntersectionObserver` / `visibilitychange`, renders one elegant still frame under `prefers-reduced-motion: reduce`. The system's only signature motion.
- **ImagePlaceholder:** a stand-in plate awaiting real studio photography — `border border-border bg-raised`, a diagonal SVG etch line (`vector-effect: non-scaling-stroke`), a 24px framed-mountain icon at 50% opacity, and a mono `text-2xs` uppercase label. Real `<astro:assets>` Images replace these calls one-for-one when assets arrive; never ship fabricated tattoo photos.

## Do's and Don'ts

### Do:
- **Do** use the semantic tokens (`bg-background`, `text-muted-foreground`, `bg-paper`, `border-tertiary-400`) over raw scale steps. They are the single point of change when the world is retuned.
- **Do** set every site-level wrapper to `.shell` and override `--shell-max` on the element for narrower pages (about article, booking slip) rather than reaching for a different container utility.
- **Do** keep Cinzel for display and headings, Archivo for body, JetBrains Mono for serials, dates, sizes, and field labels only (The Chisel Rule).
- **Do** ship `ImagePlaceholder` for every image asset until Boris supplies real photography; swap each call for an `<astro:assets>` Image one-for-one when it arrives.
- **Do** gate the hero's mercury shader on `prefers-reduced-motion: reduce` (render one still frame) and on `IntersectionObserver` / `visibilitychange` (pause when off-screen or tab-hidden) — the perf profile is part of the craft.
- **Do** carry an `AssayMark` (serial · placement · session) on every registered piece; it is the brand's recurring signature.
- **Do** use 1px hairline `border-border` rules as the structural separator between surfaces; the tonal step from `background` to `raised` carries the rest.

### Don't:
- **Don't** apply beige to a section background, card fill, or decorative accent (The Paper Rule). It is for documents, seals, stamps, focus rings, and the primary button only.
- **Don't** set body copy in beige, reverse the silver-on-graphite relationship, or use Cinzel / Archivo / JetBrains Mono outside their assigned roles (The Two-Ink Rule + The Chisel Rule).
- **Don't** add resting shadows, ambient elevation, intermediate radii, or faux-depth gradients that don't read as a physical consequence of a surface (Flat-By-Default). The hero veil and the portfolio figcaption gradient are the only sanctioned gradients.
- **Don't** use `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, or `rounded-4xl` on any resting surface. The register is sharp; `rounded-full` is only for the wax seal and the sealed assay mark.
- **Don't** wire the booking form to a fake success state or fabricate tattoo photos, testimonials, press quotes, or case studies. The form is a placeholder until `apps/api` exists; real assets arrive from Boris only.
- **Don't** invent intermediate assays beyond `serial · placement · session` — the three-part stamp is the canonical assay mark.