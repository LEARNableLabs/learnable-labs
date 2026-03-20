# LEARNable Labs — Effects Reference

A complete catalog of every visual effect in the animation playground.

---

## Shape Visualizations

All shapes are rendered on a 2D canvas using trigonometric math and perspective projection (`perspective = 800 / (800 + z)`). No WebGL or 3D libraries — just parametric equations projected to screen coordinates.

### Geometric Shapes

| Shape | Description | Key Math |
|-------|-------------|----------|
| **Torus** | 3D donut (flat ring with minor radius depth) | `x = (R + r·cos(v))·cos(u)`, two-angle parametric surface |
| **Sphere** | Evenly distributed point cloud | Fibonacci spiral via golden ratio for uniform spacing |
| **Circle** | Breathing ring | Single-angle parametric with oscillating radius (`sin(frame)`) |
| **Cube** | 6-face rotating point cloud | Points distributed across 6 planar faces, Y-axis rotation |
| **Helix** | 4-turn 3D spiral | Linear Y interpolation + circular XZ, continuous rotation |

### Chaotic Systems

| Shape | Description | Key Math |
|-------|-------------|----------|
| **Lorenz Attractor** | Butterfly-wing strange attractor | Integrates `dx/dt = σ(y−x)`, `dy/dt = x(ρ−z)−y`, `dz/dt = xy−βz` per frame (σ=10, ρ=28, β=8/3) |
| **Rössler Attractor** | Calm spirals with sudden vertical spikes | Integrates `dx/dt = −y−z`, `dy/dt = x+ay`, `dz/dt = b+z(x−c)` (a=0.2, b=0.2, c=5.7) |
| **Diverge** | Order-to-chaos transition | Starts as a random geometric shape; per-particle noise velocity accumulates via cubic ramp (`chaos³`), gradually dissolving structure |

### Cellular Automata

| Shape | Description | Key Math |
|-------|-------------|----------|
| **Game of Life** | Conway's CA on a tilted, rotating 3D plane | Toroidal grid, standard B3/S23 rules, one dot per living cell, random seed on init |
| **Wolfram 1D CA** | Elementary automaton wrapped on a rotating cylinder | Supports all 256 rules (default Rule 30), rows grow downward and scroll off |

---

## Interaction Effects

### Mouse Repulsion
- Shape points push away from the cursor when it hovers over the canvas
- **Falloff:** quadratic — `force = (1 − dist/150)² × repelStrength`
- **Direction:** calculated via `atan2(dy, dx)`
- **Recovery:** points spring back at rate `0.08` per frame (lerp toward zero offset)
- Configurable strength via the Mouse Repel slider (0–100)

### Click Burst
- Clicking anywhere on the shape canvas triggers an explosive radial force
- **Initial strength:** 300, **decay:** `× 0.97` per frame, **radius:** 400px
- **Recovery rate:** slower than mouse repulsion (`0.015`), creating a lingering scatter effect
- Burst ends when strength drops below 0.5

---

## Scroll & Reveal Effects

### Scroll Reveal
- Elements with class `.reveal` are observed via `IntersectionObserver`
- When an element enters the viewport past the threshold, class `.visible` is added
- CSS transitions handle three simultaneous animations:
  - **Opacity:** 0 → 1
  - **Slide up:** `translateY(Npx)` → `translateY(0)` (configurable distance)
  - **Blur:** `blur(Npx)` → `blur(0)` (configurable amount and separate duration)
- Easing and duration are fully configurable via the controls panel
- Each element is unobserved after reveal (one-shot animation)

### Staggered Nav Entrance
- Brand name appears first (100ms delay)
- Each nav link follows with a configurable stagger delay between them (default 80ms)
- Uses sequential `setTimeout` calls with CSS transition on each element

### Hero Reveal Sequence
A timed cascade when the page loads or animations replay:
1. **1000ms** — title (`LEARNable Labs`) fades in
2. **2000ms** — subtitle (`Compounding Deliberate Curiosity`) fades in
3. **3000ms** — shape canvas fades in and animation loop starts

---

## Background Effects

### Floating Particles
- Dots of random size (0.5–2.5px) and low opacity (0–0.25) drift across the full viewport
- Movement wraps around screen edges (toroidal boundary)
- Rendered on a fixed, full-screen canvas behind all content
- Configurable count (0–400) and speed (0–2)

### Connecting Lines
- Lines are drawn between any two particles within 120px of each other
- Line opacity fades with distance: `0.15 × (1 − dist/120)`
- Line width: 0.5px
- Creates a subtle mesh/network visual that shifts as particles move

---

## Visual Modifiers

### Glow
- Each shape point can have a soft halo drawn behind it
- Rendered as a larger, semi-transparent circle (`opacity × 0.07`) before the solid dot
- Configurable size (0–15px); set to 0 for no glow

### Depth Sorting & Opacity
- All shape points are sorted back-to-front by z-coordinate before drawing
- Opacity varies with depth: `0.2 + 0.45 × normalized_z` — farther points are dimmer
- Point size scales with perspective: `dotSize × perspective`

### Perspective Projection
- Single vanishing-point projection: `scale = 800 / (800 + z)`
- Screen position: `screenX = cx + (worldX − cx) × scale`
- Creates convincing 3D depth on a flat 2D canvas

---

## Presets

| Preset | Points | Rotation | Glow | Blur | Particles | Character |
|--------|--------|----------|------|------|-----------|-----------|
| **FRL Original** | 200 | 1.0 | 5 | 12px | 200 | Warm academic defaults |
| **Minimal** | 100 | 0.5 | 0 | 0 | 0 | Clean, no effects |
| **Dramatic** | 400 | 0.5 | 10 | 20px | 120 | Slow, heavy, dense |
| **Snappy** | 200 | 3.0 | 3 | 4px | 30 | Fast with bounce easing |
| **Dreamy** | 300 | 0.3 | 12 | 25px | 100 | Slow, ethereal, soft |

Each preset sets all parameters at once: shape points, radii, rotation speed, dot size, glow, mouse repel, scroll reveal timing, easing, blur, stagger, and particle count/speed.
