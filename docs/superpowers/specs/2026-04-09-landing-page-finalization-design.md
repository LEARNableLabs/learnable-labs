# LEARNable Labs — Landing Page Finalization

## Overview

Transform the current animation playground into a clean landing page while preserving the playground behind an easter egg. Minimal changes to existing code — leverage the existing `fullpage` CSS state as the default.

## Design Decisions

### 1. Default Layout & Easter Egg

**Default (visitor view):**
- Controls panel, prompt bar, Panel button, and Full Page button are all hidden
- Page renders full-width (`margin-left: 0`) — no panel offset
- All animations, scroll reveals, nav stagger, and background particles work as before
- Random shape on each page load (kept)

**Easter egg (playground mode):**
- `Ctrl+.` (Mac: `Cmd+.`) toggles playground mode
- Reveals: controls panel, prompt bar, Panel/Full Page buttons
- Page shifts right to accommodate the 280px panel
- Toggling again hides everything and returns to landing page mode

**Implementation approach:**
- By default, hide playground UI with CSS (controls, prompt bar, toggle/fullpage buttons all get `display: none` or equivalent). Do NOT reuse the existing `fullpage` class — that has its own toggle logic. Instead, use a new `body.playground` class that reveals them.
- Add a `keydown` listener for the shortcut that toggles the `playground` class on `<body>`
- CSS: playground UI is hidden by default; `body.playground` selectors make them visible
- The toggle-btn and fullpage-btn stay in the DOM but are hidden until playground mode is active
- JS init: skip auto-showing controls. The existing `fullpage` toggle and `panel collapse` logic only runs when playground mode is active.

### 2. Hero CTA Button

- "Explore OpenTutor" button centered below the subtitle in the hero section
- Links to `https://github.com/LEARNableLabs/opentutor` (opens in new tab)
- Styled with accent color (`#6b5b3e`) background, light text (`#F5F1E8`)
- Hover: slightly lighter background
- Appears with scroll reveal animation (same as subtitle, slightly delayed)

### 3. Content Polish

**Research section:**
- "it shouldn't be made harder by poor tools" → "poor tools shouldn't make it harder"
- "Imagine a study companion..." → "A study companion..." (more assertive)

**Product section:**
- "an AI companion" → "an open-source AI companion" (aligns with GitHub CTA)

**Team section:**
- "Built by researchers and engineers from MIT, Red Hat AI and IBM, on a mission to democratize access to world-class learning experiences." → "Researchers and engineers from MIT, Red Hat AI, and IBM — on a mission to democratize world-class learning."

**Method cards:** No changes.

### 4. Mobile Responsiveness

Single breakpoint at `max-width: 768px`:

- **Nav:** brand stacks above links; links center and wrap
- **Hero h1:** 80px → 40px font-size
- **Hero subtitle:** 20px → 16px
- **Section padding:** `32px 56px` → `24px 20px`
- **Card grid:** `grid-template-columns: 1fr 1fr` → `1fr` (single column)
- **Shape canvas:** scales down via existing `Math.min(innerWidth, innerHeight) * 0.9`
- **Playground:** easter egg shortcut disabled below 768px (panel isn't usable on small screens)

### 5. Meta Tags & Footer

**Meta tags (in `<head>`):**
- `<meta name="description" content="LEARNable Labs — building OpenTutor, an open-source AI learning companion. Compounding deliberate curiosity.">`
- `<meta name="viewport">` already present

**Brand link fix:**
- `<a class="brand" href="">` → `<a class="brand" href="#">` (prevents full reload on click)

**Footer:**
- Add "Explore OpenTutor on GitHub" link in the footer
- Keep existing footer text

### 6. Cleanup

- Update `LEARNABLE.md` to remove reference to `animation-playground.html` (old filename)
- Add `docs/` to `.gitignore` if not already present — or leave it tracked (it's a spec, fine to commit)

## Files Modified

- `index.html` — add meta tags, CTA button, fix brand href, footer link
- `index.css` — add default hidden state for playground UI, mobile breakpoint, CTA styles
- `index.js` — add keyboard shortcut listener, start in landing-page mode (skip showing controls on init)
- `LEARNABLE.md` — fix stale filename reference

## Out of Scope

- No dark mode or color theme changes
- No new sections or pages
- No build step or framework introduction
- No favicon or OG image
- No analytics or tracking
