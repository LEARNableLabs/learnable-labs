# LEARNable Labs

Interactive animation playground and landing page for LEARNable Labs — an ed-tech venture building OpenTutor, an AI learning companion.

## Project Structure

Single-page vanilla web app (no build step, no frameworks):

- `index.html` — page structure: nav, hero with canvas, content sections (Research, Method, Product, Team), controls panel, prompt bar
- `index.js` — all logic in an IIFE: shape rendering, cellular automata, background particles, scroll reveals, UI controls
- `index.css` — styling with CSS custom properties, dark control panel, warm off-white (#F5F1E8) academic aesthetic
- `LEARNABLE.md` — detailed technical design doc and project notes

## Key Features

### 3D Shape Visualizations (2D Canvas, No WebGL)
Shapes rendered via parametric equations + perspective projection (`800 / (800 + z)`):
- **Geometric:** Torus, Sphere (Fibonacci), Circle, Cube, Helix
- **Chaotic systems:** Lorenz attractor, Rossler attractor, Diverge (order-to-chaos)
- **Cellular automata:** Conway's Game of Life (3D tilted grid), Wolfram 1D CA (cylinder-wrapped, rules 0-255)

### Animation System
- Scroll-triggered reveals via `IntersectionObserver` + CSS transitions (opacity, translateY, blur)
- Staggered nav entrance with configurable delay
- Background particle system with connecting lines (canvas `requestAnimationFrame`)
- Mouse repulsion on shape points (quadratic falloff + spring recovery)
- Click burst effect on shape canvas

### Controls Panel (Left Sidebar)
- **Presets:** FRL Original, Minimal, Dramatic, Snappy, Dreamy
- **Shape params:** visualization type, point count, radii, rotation speed, dot size, glow, mouse repel
- **CA params:** grid size, Wolfram width/rows/rule, tick speed
- **Scroll reveal:** duration, slide distance, easing curve, threshold
- **Blur reveal:** amount, duration
- **Stagger:** nav stagger delay
- **Particles:** count, speed

### UI Controls
- Panel toggle (collapse/expand sidebar)
- Full Page mode (hides all UI)
- Replay All Animations button
- Random shape on page load
- Prompt bar at bottom: generates natural-language description of current config with copy button

## Architecture

Major JS modules (object literals in IIFE):
- `ShapeRenderer` — canvas drawing, 3D math, mouse/burst interaction
- `CASimulator` — Game of Life and Wolfram automata stepping
- `BackgroundParticles` — floating dots with connecting lines
- `ScrollReveal` — IntersectionObserver setup, nav/hero reveal, replay
- `UIController` — slider/select/button bindings, dynamic CSS injection, preset application, prompt generation

## Tech Stack
- Vanilla HTML/CSS/JS (no dependencies, no build)
- EB Garamond font (Google Fonts CDN)
- CSS custom properties for theming
