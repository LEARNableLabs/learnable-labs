# LEARNable Labs — Animation Playground

## Idea

Build an interactive animation playground inspired by [fundamentalresearchlabs.com](https://fundamentalresearchlabs.com/), exploring their animation techniques and extending them with chaotic systems and cellular automata.

The core insight from FRL: they render a 3D torus on a **2D canvas** using parametric equations and perspective projection — no WebGL or Three.js needed. Animations are driven by `IntersectionObserver` scroll reveals and CSS transitions toggled via class names.

## What We Built

**File:** `animation-playground.html` — a single self-contained HTML file with inline CSS/JS.

### 3D Shape Visualizations

All rendered on 2D canvas with trigonometric projection (`perspective = 800 / (800 + z)`).

**Geometric shapes:**
- Torus (flat donut, minor radius 25)
- Sphere (Fibonacci point distribution)
- Circle (breathing ring)
- Cube (6-face point cloud)
- Helix (4-turn spiral)

**Chaotic systems:**
- Lorenz attractor — integrates `dx/dt = σ(y-x), dy/dt = x(ρ-z)-y, dz/dt = xy-βz` per frame. Points start clustered, diverge into butterfly wings. Sensitive dependence on initial conditions visible in real-time.
- Rössler attractor — `dx/dt = -y-z, dy/dt = x+ay, dz/dt = b+z(x-c)`. Calm spirals with sudden z-spikes.
- Diverge — torus that decays into chaos via cubic-ramped per-particle noise.

**Cellular automata:**
- Conway's Game of Life — toroidal grid rendered as dots on a tilted, rotating 3D plane. Random seed on init.
- Wolfram 1D CA — elementary automaton (Rule 30 default) wrapped around a rotating cylinder. Supports all 256 rules.

### Animation Techniques (from FRL)

- **Scroll reveals:** `IntersectionObserver` adds `.visible` class → CSS transitions handle `opacity`, `transform: translateY()`, `filter: blur()`.
- **Staggered nav:** sequential `setTimeout` with configurable delay between items.
- **Background particles:** canvas `requestAnimationFrame` loop with connecting lines between nearby points.
- **Mouse repulsion:** `atan2` for direction, quadratic falloff `(1 - dist/150)²`, spring-back via `offset += (target - offset) * 0.08`.

### Controls

- Shape selector + parameters (points, radii, rotation, dot size, glow, repel)
- Canvas scale (1x–10x hero, centered)
- CA parameters (grid size, Wolfram width/rows/rule 0-255, tick speed)
- Scroll reveal (duration, slide distance, easing, threshold)
- Blur reveal (amount, duration)
- Nav stagger delay
- Background particles (count, speed)

### Presets

| Preset | Shape | Character |
|--------|-------|-----------|
| FRL Original | Torus | Warm academic defaults |
| Minimal | Circle | No blur, no particles, white |
| Dramatic | Torus | Slow, heavy blur, dense particles |
| Snappy | Sphere | Fast, bounce easing |
| Dreamy | Helix | Slow, heavy blur, faint particles |
| Chaos | Lorenz | Strange attractor |
| Life | Game of Life | Slow grid evolution |

### UI

- **Full Page** button — hides all UI for clean viewing
- **Panel** toggle — collapse/expand controls
- **Replay** — resets all animations and CA seeds
- **Random shape on load** — picks a random shape each visit
- **Prompt output** — generates copy-paste natural language description of current config

## Branding

- **LEARNable Labs** — 80px EB Garamond
- **Compounding Deliberate Curiosity** — subtitle
- Warm off-white (#F5F1E8), serif academic aesthetic

## Key Technical Decisions

1. **No WebGL** — 2D canvas + math is sufficient for 200-500 points at 60fps. Simpler, no shader compilation overhead.
2. **No animation libraries** — vanilla JS `IntersectionObserver` + CSS transitions. Lightweight and framework-agnostic.
3. **Single HTML file** — fully self-contained, no build step, opens in any browser.
4. **Parametric 3D on 2D canvas** — torus: `x = (R + r·cos(v))·cos(u)`, perspective divide for depth. Back-to-front sorting for occlusion.
5. **CA as shapes** — Game of Life and Wolfram automata bypass the point-particle system, iterating grids directly and emitting one dot per living cell.

## Possible Extensions

- Shape morphing with smoothstep interpolation between any two shapes
- Color themes (dark mode, custom palettes)
- More CA rules (Langton's ant, Brian's Brain, wireworld)
- 3D Game of Life
- Audio reactivity
- Export current config as standalone HTML snippet for embedding
