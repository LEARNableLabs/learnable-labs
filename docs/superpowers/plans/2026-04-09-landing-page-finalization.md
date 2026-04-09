# Landing Page Finalization — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the animation playground into a clean landing page with the playground hidden behind a `Ctrl+.` / `Cmd+.` easter egg.

**Architecture:** Minimal changes to 3 existing files (index.html, index.css, index.js) + 1 doc update (LEARNABLE.md). The existing `fullpage` CSS class is NOT reused — a new `body.playground` class controls playground visibility. Default state hides all dev UI. No new files, no build step, no dependencies.

**Tech Stack:** Vanilla HTML/CSS/JS (no framework, no build)

**Note:** This is a zero-dependency vanilla project with no test framework. Verification steps use manual browser checks instead of automated tests.

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `index.css` | Modify | Default-hide playground UI, `body.playground` reveal styles, CTA button styles, mobile breakpoint |
| `index.html` | Modify | Meta tags, CTA button, copy polish, brand href fix, footer link |
| `index.js` | Modify | Keyboard shortcut listener, suppress playground UI on init |
| `LEARNABLE.md` | Modify | Fix stale `animation-playground.html` reference |

---

### Task 1: CSS — Default-Hide Playground UI & Reveal with `body.playground`

**Files:**
- Modify: `index.css` (append new sections after existing styles)

- [ ] **Step 1: Add default-hide rules for playground UI**

At the end of `index.css`, add:

```css
/* ═══════════════════════════════════════════════════════════════════════════
   LANDING PAGE MODE (default)
   ═══════════════════════════════════════════════════════════════════════════ */
.controls,
.prompt-bar,
.toggle-btn,
.fullpage-btn {
  display: none;
}

.page {
  margin-left: 0;
}
```

- [ ] **Step 2: Add `body.playground` reveal rules**

Immediately below the landing page rules, add:

```css
/* ═══════════════════════════════════════════════════════════════════════════
   PLAYGROUND MODE (activated via Ctrl+. / Cmd+.)
   ═══════════════════════════════════════════════════════════════════════════ */
body.playground .controls {
  display: block;
}

body.playground .prompt-bar {
  display: flex;
}

body.playground .toggle-btn,
body.playground .fullpage-btn {
  display: block;
}

body.playground .page {
  margin-left: 280px;
}

body.playground .controls.collapsed ~ .page {
  margin-left: 0;
}
```

- [ ] **Step 3: Remove conflicting default styles from existing rules**

In the existing `.page` rule (around line 50), remove the `margin-left: 280px` so the new rules take precedence:

Change:
```css
.page {
  position: relative;
  z-index: 1;
  margin-left: 280px;
  padding-bottom: 80px;
  transition: margin-left 0.3s ease;
}
```

To:
```css
.page {
  position: relative;
  z-index: 1;
  padding-bottom: 80px;
  transition: margin-left 0.3s ease;
}
```

Also remove the `.controls:not(.collapsed) ~ .toggle-btn` rule (around line 207-209) since playground mode handles this:

Remove:
```css
.controls:not(.collapsed) ~ .toggle-btn {
  left: 292px;
}
```

And replace with:
```css
body.playground .controls:not(.collapsed) ~ .toggle-btn {
  left: 292px;
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html` in a browser. Confirm:
- Controls panel is NOT visible
- Prompt bar is NOT visible
- Panel and Full Page buttons are NOT visible
- Page content renders full-width
- Animations and scroll reveals still work

- [ ] **Step 5: Commit**

```bash
git add index.css
git commit -m "style: hide playground UI by default, add body.playground reveal"
```

---

### Task 2: CSS — CTA Button Styles

**Files:**
- Modify: `index.css` (add after content section styles, before animations)

- [ ] **Step 1: Add CTA button styles**

Add before the `/* ANIMATIONS */` section in `index.css`:

```css
/* ═══════════════════════════════════════════════════════════════════════════
   CTA BUTTON
   ═══════════════════════════════════════════════════════════════════════════ */
.cta-btn {
  display: inline-block;
  margin-top: 28px;
  padding: 14px 32px;
  background: var(--accent);
  color: var(--bg-light);
  text-decoration: none;
  font-family: 'EB Garamond', Georgia, serif;
  font-size: 18px;
  border-radius: 6px;
  transition: background 0.2s ease;
  opacity: 0;
}

.cta-btn:hover {
  background: #7d6b4a;
}

.cta-btn.visible {
  opacity: 1;
}
```

- [ ] **Step 2: Verify styles render correctly**

The button won't be visible yet (HTML not added). Just confirm no CSS syntax errors by reloading the page — existing styles should still work.

- [ ] **Step 3: Commit**

```bash
git add index.css
git commit -m "style: add CTA button styles"
```

---

### Task 3: CSS — Mobile Breakpoint

**Files:**
- Modify: `index.css` (append at end, after playground mode rules)

- [ ] **Step 1: Add mobile breakpoint**

At the very end of `index.css`, add:

```css
/* ═══════════════════════════════════════════════════════════════════════════
   MOBILE (basic responsiveness)
   ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .site-nav {
    flex-wrap: wrap;
    justify-content: center;
    padding: 14px 20px;
    gap: 12px;
  }

  .site-nav .brand {
    width: 100%;
    text-align: center;
  }

  .hero h1 {
    font-size: 40px;
  }

  .hero p {
    font-size: 16px;
  }

  section {
    padding: 24px 20px;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .cta-btn {
    font-size: 16px;
    padding: 12px 24px;
  }
}
```

- [ ] **Step 2: Verify in browser**

Open browser dev tools, toggle responsive mode to ~375px width. Confirm:
- Nav wraps: brand centered on top, links wrap below
- Hero title is smaller (~40px), not overflowing
- Cards stack vertically
- Section padding is tighter
- No horizontal scrollbar

- [ ] **Step 3: Commit**

```bash
git add index.css
git commit -m "style: add mobile breakpoint at 768px"
```

---

### Task 4: HTML — Meta Tags, CTA, Copy Polish, Footer

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add meta description tag**

In `<head>`, after the `<meta name="viewport">` line (line 5), add:

```html
<meta name="description" content="LEARNable Labs — building OpenTutor, an open-source AI learning companion. Compounding deliberate curiosity.">
```

- [ ] **Step 2: Fix brand href**

Change line 25:
```html
<a class="brand" href="">LEARNable Labs</a>
```

To:
```html
<a class="brand" href="#">LEARNable Labs</a>
```

- [ ] **Step 3: Add CTA button to hero**

After the subtitle `<p>` tag in the hero section (line 35), add:

```html
<a class="cta-btn reveal" style="opacity: 0;" href="https://github.com/LEARNableLabs/opentutor" target="_blank" rel="noopener noreferrer">Explore OpenTutor</a>
```

- [ ] **Step 4: Polish Research section copy**

Change line 42:
```html
<p class="body reveal">We're solving education at scale in an AI-driven world. Learning is inherently challenging — it shouldn't be made harder by poor tools.</p>
```

To:
```html
<p class="body reveal">We're solving education at scale in an AI-driven world. Learning is inherently challenging — poor tools shouldn't make it harder.</p>
```

Change line 43:
```html
<p class="body reveal">We harness the natural human appetite for social interaction to build compounding learning habits. Imagine a study companion with encyclopedic knowledge and infinite patience, always available when you need them.</p>
```

To:
```html
<p class="body reveal">We harness the natural human appetite for social interaction to build compounding learning habits. A study companion with encyclopedic knowledge and infinite patience — always available when you need it.</p>
```

- [ ] **Step 5: Polish Product section copy**

Change line 74:
```html
<p class="body reveal">We're building OpenTutor — an AI companion that makes learning niche topics feel natural and achievable.</p>
```

To:
```html
<p class="body reveal">We're building OpenTutor — an open-source AI companion that makes learning niche topics feel natural and achievable.</p>
```

- [ ] **Step 6: Polish Team section copy**

Change line 82:
```html
<p class="body reveal">Built by researchers and engineers from MIT, Red Hat AI and IBM, on a mission to democratize access to world-class learning experiences.</p>
```

To:
```html
<p class="body reveal">Researchers and engineers from MIT, Red Hat AI, and IBM — on a mission to democratize world-class learning.</p>
```

- [ ] **Step 7: Add GitHub link to footer**

Change line 86:
```html
<footer class="reveal">
    LEARNable Labs — Compounding Deliberate Curiosity
</footer>
```

To:
```html
<footer class="reveal">
    LEARNable Labs — Compounding Deliberate Curiosity
    <br><a href="https://github.com/LEARNableLabs/opentutor" target="_blank" rel="noopener noreferrer" style="color: var(--accent); opacity: 0.6;">Explore OpenTutor on GitHub</a>
</footer>
```

- [ ] **Step 8: Verify in browser**

Open `index.html`. Confirm:
- Meta description visible in page source
- Brand link doesn't cause page reload
- CTA button appears in hero, links to GitHub in new tab
- Research, Product, Team copy reflects the polished versions
- Footer shows GitHub link

- [ ] **Step 9: Commit**

```bash
git add index.html
git commit -m "content: add meta tags, CTA button, polish copy, footer link"
```

---

### Task 5: JS — Keyboard Shortcut & Landing Page Init

**Files:**
- Modify: `index.js`

- [ ] **Step 1: Add keyboard shortcut listener**

After the `UIController` object definition (after the closing `};` around line 1072) and before the `init()` function, add:

```js
/* ═══════════════════════════════════════════════════════════════════════════
   PLAYGROUND EASTER EGG (Ctrl+. / Cmd+.)
   ═══════════════════════════════════════════════════════════════════════════ */

function setupPlaygroundShortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === '.' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (window.innerWidth <= 768) return;
      document.body.classList.toggle('playground');
    }
  });
}
```

- [ ] **Step 2: Call the shortcut setup from init**

In the `init()` function (around line 1078), add `setupPlaygroundShortcut();` as the last line, after `UIController.updatePrompt();`:

Change:
```js
function init() {
  generateControls();
  ShapeRenderer.init();
  CASimulator.initLife();
  CASimulator.initWolfram();
  BackgroundParticles.init();
  BackgroundParticles.create();
  UIController.init();
  UIController.randomizeShape();
  ScrollReveal.revealNav();
  ScrollReveal.revealHero();
  ScrollReveal.setupObserver();
  UIController.updatePrompt();
}
```

To:
```js
function init() {
  generateControls();
  ShapeRenderer.init();
  CASimulator.initLife();
  CASimulator.initWolfram();
  BackgroundParticles.init();
  BackgroundParticles.create();
  UIController.init();
  UIController.randomizeShape();
  ScrollReveal.revealNav();
  ScrollReveal.revealHero();
  ScrollReveal.setupObserver();
  UIController.updatePrompt();
  setupPlaygroundShortcut();
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Confirm:
- Page loads as clean landing page (no controls)
- Press `Ctrl+.` (or `Cmd+.` on Mac) — controls panel, prompt bar, and buttons appear; page shifts right
- Press `Ctrl+.` again — everything hides, back to clean landing page
- Resize browser to <768px width, press `Ctrl+.` — nothing happens
- Animations and shape rendering still work in both modes

- [ ] **Step 4: Commit**

```bash
git add index.js
git commit -m "feat: add Ctrl+. easter egg to toggle playground mode"
```

---

### Task 6: Cleanup — Fix LEARNABLE.md

**Files:**
- Modify: `LEARNABLE.md`

- [ ] **Step 1: Fix stale filename reference**

Change line 11:
```markdown
**File:** `animation-playground.html` — a single self-contained HTML file with inline CSS/JS.
```

To:
```markdown
**Files:** `index.html`, `index.css`, `index.js` — vanilla web app with no build step.
```

- [ ] **Step 2: Commit**

```bash
git add LEARNABLE.md
git commit -m "docs: fix stale filename reference in LEARNABLE.md"
```

---

## Final Verification

After all tasks are complete:

- [ ] Open `index.html` in browser — clean landing page, no playground UI
- [ ] Scroll through all sections — reveals animate correctly
- [ ] Click "Explore OpenTutor" — opens GitHub repo in new tab
- [ ] Press `Ctrl+.` / `Cmd+.` — playground appears with all controls functional
- [ ] Press shortcut again — playground hides
- [ ] Test at 375px width — layout is readable, nothing overflows
- [ ] Check page source — meta description tag present
