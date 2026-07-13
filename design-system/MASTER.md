# Smart Walking Stick — Design System (MASTER)

Global source of truth for the SWS website. Every page and component follows these rules unless a page-specific override exists in `design-system/pages/`.

**Design intent:** a personal engineering story, not a product pitch. Warm, calm, trustworthy, premium and quiet. Editorial long-form reading comfort first; technical credibility expressed through restraint and precision, not flash. Reference points: Apple HIG clarity, Stripe docs readability, Notion calm, modern engineering portfolios.

---

## 1. Colour Palette

Warm paper neutrals with a deep slate-blue primary and a terracotta warmth accent. Evolved from the existing site so the identity stays recognisable. All ratios below are computed WCAG contrast ratios.

### Core tokens

| Token | Hex | Role |
|---|---|---|
| `--color-bg` | `#FAF7F2` | Page background (warm paper) |
| `--color-bg-alt` | `#F3EDE2` | Alternate section background (sand) |
| `--color-surface` | `#FFFFFF` | Cards, panels, header |
| `--color-ink` | `#2B2924` | Primary text (13.6:1 on bg) |
| `--color-ink-soft` | `#5C574D` | Secondary text (6.7:1 on bg) |
| `--color-ink-faint` | `#6E675C` | Captions, metadata (5.2:1 on bg, min size 0.85rem) |
| `--color-primary` | `#33608C` | Links, primary buttons, active states (6.2:1 on bg) |
| `--color-primary-deep` | `#274A6D` | Hover/pressed, emphasis (8.6:1 on bg) |
| `--color-accent` | `#C2643C` | Terracotta warmth. LARGE text (18px+ bold / 24px+), graphics and decorative use ONLY (4.05:1) |
| `--color-accent-text` | `#9C4A26` | Terracotta at body-text size (5.7:1 on bg) |
| `--color-line` | `#E7E0D4` | Borders, dividers |
| `--color-footer-bg` | `#2B2924` | Dark footer; text `#FAF7F2` (13.6:1) |
| `--color-focus` | `#33608C` | Focus rings |
| `--color-error` | `#B3261E` | Form errors (with icon or text, never colour alone) |

### Usage rules
- Never place `--color-accent` (#C2643C) as normal-size body text; use `--color-accent-text` instead.
- Text on `--color-primary` fills is always white (6.6:1). Text on `--color-primary-deep` fills is white (9.2:1).
- No pure black, no neon, no purple/pink gradients. Gradients limited to background washes between two adjacent neutrals (e.g. sand to paper) at low intensity.
- Semantic tokens only in components; raw hex lives only in the `:root` block.

## 2. Typography

| Role | Font | Fallback |
|---|---|---|
| Display / headings | **Fraunces** (weights 500, 600) | Georgia, serif |
| Body / UI | **Inter** (weights 400, 500, 600) | Segoe UI, system-ui, sans-serif |
| Technical labels / small caps metadata | Inter 600, letter-spacing 0.06em, uppercase, 0.78-0.85rem | — |

Load via Google Fonts with `display=swap`, preconnect, and only the weights listed. Self-host later if performance requires.

### Type scale (fluid, rem-based)

| Token | Size | Use |
|---|---|---|
| `--text-display` | `clamp(2.4rem, 5vw, 3.6rem)` | Page hero H1 |
| `--text-h1` | `clamp(2rem, 4vw, 2.6rem)` | Page titles |
| `--text-h2` | `clamp(1.5rem, 3vw, 1.9rem)` | Section headings |
| `--text-h3` | `1.2rem` | Sub-headings, card titles |
| `--text-body-lg` | `1.15rem` | Ledes, intro paragraphs |
| `--text-body` | `1.0625rem` (17px) | Body copy |
| `--text-small` | `0.9rem` | Captions, footnotes |
| `--text-label` | `0.8rem` | Uppercase labels, badges |

### Rules
- Body line-height 1.7; headings 1.15-1.25.
- Measure: 65-75 characters; prose containers max-width 42rem (672px).
- Minimum body size 16px on mobile (prevents iOS zoom).
- Bold is Inter 600, not 700, to keep the page calm.
- No em dashes or double hyphens anywhere in site copy. Use commas, colons, or separate sentences.

## 3. Spacing Scale

Base unit 4px. Spacious density: generous whitespace is a core feature.

`--space-1` 4px · `--space-2` 8px · `--space-3` 12px · `--space-4` 16px · `--space-5` 24px · `--space-6` 32px · `--space-7` 48px · `--space-8` 64px · `--space-9` 96px · `--space-10` 128px

- Vertical rhythm between page sections: `--space-9` desktop, `--space-8` mobile.
- Card internal padding: `--space-6` desktop, `--space-5` mobile.
- Paragraph spacing: 1em. Heading top margin: 2.5em (creates section breathing room).

## 4. Border Radius

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | Inputs, small chips, images inside cards |
| `--radius-md` | 14px | Cards, figures, panels |
| `--radius-lg` | 20px | Hero panels, feature blocks |
| `--radius-full` | 999px | Pills, buttons, badges |

## 5. Elevation / Shadows

Warm-tinted, low-opacity shadows only. Exactly three levels, never mixed arbitrarily:

| Token | Value | Use |
|---|---|---|
| `--shadow-1` | `0 1px 3px rgba(43,41,36,0.06), 0 1px 2px rgba(43,41,36,0.04)` | Resting cards |
| `--shadow-2` | `0 4px 14px rgba(43,41,36,0.08)` | Hover, sticky header |
| `--shadow-3` | `0 12px 32px rgba(43,41,36,0.12)` | Modals, lightbox only |

Cards pair `--shadow-1` with a `1px solid var(--color-line)` border. Never shadow without border on the paper background.

## 6. Iconography

- Single icon set: **Lucide** (inline SVG, stroke 1.75, `stroke="currentColor"`, `fill="none"`). Copy the paths inline; no icon font, no CDN request at runtime.
- Sizes: 20px inline with text, 24px in cards, 28px maximum in feature blocks.
- No emoji as icons anywhere (replaces the current 🔊 📳 🔴 usage).
- Decorative icons get `aria-hidden="true"`. Icon-only controls get `aria-label`.

## 7. Grid System

- Content container: `max-width: 1080px`, padding-inline `--space-5` (mobile) to `--space-6` (desktop).
- Prose container: `max-width: 42rem`, centred.
- Card grids: CSS Grid, `repeat(auto-fit, minmax(240px, 1fr))`, gap `--space-5`.
- Two-column story layouts (text + image): 7/5 split at ≥900px, stacked below.
- No horizontal scroll at any width from 320px up.

## 8. Responsive Breakpoints

Mobile-first. `--bp-sm: 600px` (large phone), `--bp-md: 768px` (tablet), `--bp-lg: 1024px` (desktop), `--bp-xl: 1280px` (wide). Test at 375, 768, 1024, 1440.

## 9. Buttons

| Variant | Style | Use |
|---|---|---|
| Primary | `--color-primary` fill, white text, `--radius-full`, padding 0.8rem 1.6rem | One per view maximum |
| Secondary | Transparent, 1.5px `--color-primary` border, primary text | Supporting actions |
| Quiet | Text-only link with arrow icon, primary colour | Card footers, inline CTAs |

States: hover darkens to `--color-primary-deep` and lifts to `--shadow-2` (transform: translateY(-1px)); active removes lift; focus-visible shows a 3px `--color-focus` ring offset 2px; disabled 0.5 opacity + `cursor: not-allowed`. Min touch target 44x44px. Transitions 200ms ease-out.

## 10. Cards

- Surface white, `--radius-md`, `1px solid var(--color-line)`, `--shadow-1`.
- Hover (only if the whole card is a link): translateY(-3px), `--shadow-2`, 200ms; border shifts toward `--color-primary` at 25% mix.
- Card title: Fraunces `--text-h3`; body: `--text-small`/`--text-body` in `--color-ink-soft`.
- Whole-card links use one `<a>` wrapping the card with a descriptive accessible name; no nested links inside.

## 11. Navigation

- Sticky header, white surface, 1px bottom border; `--shadow-2` appears after scrolling past 8px.
- Brand: Fraunces wordmark, links home.
- Desktop: inline nav links, `--color-ink-soft`, active page marked by 2px terracotta underline plus `aria-current="page"`.
- Mobile (<768px): disclosure button ("Menu", hamburger icon + label) toggling a vertical panel; button has `aria-expanded`; panel links min-height 44px; Escape closes.
- Donate button: a filled primary pill (`.nav-donate`) at the end of the nav on every page, linking to Stripe checkout in a new tab (`rel="noopener"`). This is the one sanctioned exception to the one-primary-CTA rule, since the header persists across views. On mobile it sits full-width at the bottom of the nav panel.
- Skip link ("Skip to main content") as first focusable element, visible on focus.
- Footer: dark ink background, cream text, three columns (project, pages, contact), collapsing to stacked on mobile.

## 12. Forms (contact and future use)

- Visible `<label>` above every field, never placeholder-only.
- Inputs: white surface, 1px `--color-line` border, `--radius-sm`, padding 0.75rem 1rem, min-height 44px; focus shows the standard focus ring.
- Errors: `--color-error` text plus warning icon below the field, `role="alert"`; message states cause and fix.
- The contact route is a plain `mailto:` link presented as a card, not a lead-gen form. No required marketing fields, ever.

## 13. Animations and Motion

Motion supports understanding; it never decorates for its own sake.

| Pattern | Spec |
|---|---|
| Scroll reveal | Fade up 16px + opacity, 500ms ease-out, IntersectionObserver at 15% visibility, once only |
| Stagger | Sibling cards delay 60ms each, max 4 steps |
| Hover micro | 200ms ease-out, transform/opacity only |
| Smooth scroll | `scroll-behavior: smooth` for anchor links |
| Cueing demo | Dedicated looping SVG/CSS animation, 12-16s loop, pausable, described in text |

Rules:
- Animate only `transform` and `opacity`. Never width/height/top/left.
- Everything honours `@media (prefers-reduced-motion: reduce)`: reveals render instantly, the cueing demo shows a static labelled diagram with a "Play" control.
- Nothing blocks input; no scroll hijacking; no parallax.

## 14. Accessibility Guidelines (WCAG 2.1 AA)

- Text contrast ≥ 4.5:1 (normal) and ≥ 3:1 (large); all tokens above are pre-verified.
- Semantic landmarks on every page: `header`, `nav`, `main`, `footer`; one `h1`; sequential heading levels.
- Keyboard: everything operable by keyboard, visible focus-visible ring everywhere, logical tab order, skip link.
- Images: meaningful photos get full descriptive alt text (the grandad and Parkinson's UK photos carry narrative weight and must be described as such); decorative SVGs get `aria-hidden`.
- Colour never carries meaning alone; pair with icon or text.
- The cueing demo animation includes a text explanation of every phase and honours reduced motion.
- Language attribute `lang="en-GB"` sensibility: British spelling throughout.
- Touch targets ≥ 44px, spaced ≥ 8px.

## 15. Tone of Imagery

- Real photographs of real moments: the grandad photo and the Parkinson's UK demonstration are the emotional anchors of the site; present them large, honestly captioned, never cropped into marketing shapes.
- Technical illustration: clean line-based SVG diagrams in the palette colours (primary blue strokes, terracotta highlights, paper background).
- No stock photography, no AI-generated people, no glossy product renders.
- Photos sit in figure cards (`--radius-md`, border, `--shadow-1`) with visible captions in `--color-ink-faint`.
- Serve WebP with PNG fallback via `<picture>`; explicit width/height to prevent layout shift; `loading="lazy"` below the fold.

## 16. Component Usage Rules

1. One primary CTA per page view; everything else secondary or quiet.
2. Section label pattern: uppercase Inter label in terracotta (`--color-accent-text`) above the Fraunces heading; use consistently on all major sections.
3. Stat/fact chips (e.g. "60-140 BPM", "3 cueing modes") use the pill badge: sand background, ink text, `--radius-full`.
4. "Implemented" vs "Future" distinction: future-work sections carry a visible "Future research" or "Planned" badge (outline pill, terracotta text) so plans are never mistaken for shipped features.
5. Timeline component for project progress: vertical line, terracotta dots, date labels in the technical label style.
6. Figures always include a caption; captions state what the reader is looking at, not marketing copy.
7. Prose pages keep the 42rem measure; full-width breakouts allowed only for figures, the timeline, card grids and the cueing demo.
8. Every page ends with the same quiet contact band (not a hard sell): short sentence + email + GitHub.
9. Consistent head block on every page: unique `<title>` ("Page — The Smart Walking Stick"), unique meta description, Open Graph title/description/image. Pages live in folders for clean URLs (`/why/`, `/about/`); internal links and asset paths are root-relative (`/css/main.css`); canonical and OG URLs are absolute on `https://www.smartwalkingstick.co.uk/`. Old flat `.html` paths keep meta-refresh redirect stubs.
10. Shared CSS in one `css/main.css` (tokens + components + page sections); shared behaviour in one `js/main.js` (nav toggle, scroll reveal, demo controls). No frameworks, no build step.
