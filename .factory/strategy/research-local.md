# Research Report — LEARNable Labs

## Project Summary

**Type:** Vanilla HTML/CSS/JS single-page web app (no build step, no frameworks)  
**Current state:** Baseline composite score 0.48  
**Code size:** 1,123 lines of JavaScript in index.js  
**Architecture:** IIFE with 5 main modules (ShapeRenderer, CASimulator, BackgroundParticles, ScrollReveal, UIController)

### Current Weaknesses

1. **Observability: 0.0** — No console logging, no error handling (try/catch), no structured logs
2. **Capability Surface: 0.08** — Limited error recovery, no user-facing error messages
3. **Tests: 0.5** — No test infrastructure detected
4. **Lint: 0.5** — No linting detected
5. **Type Check: 0.5** — No type checking detected

### Key Features to Preserve

- Canvas-based 3D shape animations (parametric equations + perspective projection)
- Cellular automata (Conway's Game of Life, Wolfram 1D CA)
- Chaotic systems (Lorenz, Rössler attractors)
- Scroll reveal animations via IntersectionObserver
- Background particle system with requestAnimationFrame
- Interactive controls panel with presets

---

## External Research Findings

### 1. Error Handling & Observability for Canvas Applications

#### The Silent Freeze Problem

Canvas animations have a critical failure mode: **errors in `requestAnimationFrame` callbacks escape your code entirely and cause the canvas to freeze** on the last drawn frame with no visible error message ([Bugnet: Crash Reporting for JavaScript Canvas Games](https://bugnet.io/blog/crash-reporting-for-javascript-canvas-games)).

**Why this matters for LEARNable Labs:**
- All shape rendering happens in a `requestAnimationFrame` loop
- An unhandled error would freeze the animation silently
- Users would see a frozen canvas with no indication of what went wrong

#### Global Error Handlers (Required)

Modern JavaScript requires **two distinct error capture mechanisms** because synchronous and asynchronous failures use different browser channels:

**1. Synchronous errors via `window.onerror`:**
```javascript
window.addEventListener('error', (event) => {
  logError({
    message: event.message,
    source: event.filename,
    line: event.lineno,
    column: event.colno,
    stack: event.error?.stack
  });
});
```

**2. Async errors via `unhandledrejection`:**
```javascript
window.addEventListener('unhandledrejection', (event) => {
  logError({
    type: 'unhandledRejection',
    reason: event.reason,
    promise: event.promise
  });
});
```

**Critical insight:** "A setup that only hooks onerror will silently miss every async failure" — both handlers are required ([Bugnet](https://bugnet.io/blog/crash-reporting-for-javascript-canvas-games)).

#### Structured Logging Best Practices

Console.log is inadequate for production. Modern approach ([OpenReplay: Error Logging Best Practices](https://blog.openreplay.com/best-practices-error-logging-javascript/)):

**Use log levels:**
- `debug`: Detailed debugging info (shape point calculations, CA state)
- `info`: Normal flow (preset applied, shape switched)
- `warn`: Degraded performance (slow frame rate, large point count)
- `error`: Recoverable errors (canvas context lost, invalid config)
- `fatal`: Critical failures (module load failure)

**Structured format (JSON objects, not strings):**
```javascript
// Poor
console.log(`User switched to ${shapeName}`);

// Better
logger.info({
  event: 'shape_switched',
  shape: shapeName,
  points: pointCount,
  timestamp: new Date().toISOString()
});
```

**Essential error context:**
- Error message and stack trace
- User action that triggered the error
- Browser and device information
- Application state (current shape, preset, animation status)
- Canvas dimensions and WebGL renderer (if applicable)

#### Browser Context for Canvas Apps

Canvas behavior varies significantly across browsers. Required context fields ([Bugnet](https://bugnet.io/blog/crash-reporting-for-javascript-canvas-games)):
- User agent, browser and version
- Operating system
- Screen and canvas dimensions
- Device class and available memory
- WebGL renderer string (if using WebGL in future)

**Why:** "The same code that runs perfectly in one browser can throw in another because of an API difference" — browser context separates universal bugs from browser-specific issues.

### 2. Frontend Observability Architecture (2026)

#### The Three Pillars

Frontend observability in 2026 combines ([Iron/Out: Frontend Observability](https://www.iron-out.io/frontend-observability/)):
1. **Metrics** — quantitative measurements (FPS, render time, point count)
2. **Traces** — request/operation flow (animation lifecycle, user interactions)
3. **Logs** — event records with context

**Key principle:** "Unlike traditional monitoring which tells you what is happening, observability helps you understand why it's happening."

#### Client-Side vs Server-Side

Client-side monitoring is essential because ([Medium: Client-side Observability](https://medium.com/@ASHISHKUMAR256/client-side-observability-b3b8931f83a7)):
- Errors occur in user browsers, not on servers
- Performance varies by device and network
- Frontend errors often never reach the server
- Real user interactions reveal edge cases

#### Practical Implementation for Vanilla JS

**Lightweight logger module:**
```javascript
const Logger = {
  _context: {},
  
  setContext(ctx) {
    Object.assign(this._context, ctx);
  },
  
  _log(level, data) {
    const entry = {
      level,
      timestamp: new Date().toISOString(),
      ...this._context,
      ...data
    };
    
    // Development: console
    if (level === 'error' || level === 'fatal') {
      console.error(entry);
    } else if (level === 'warn') {
      console.warn(entry);
    } else {
      console.log(entry);
    }
    
    // Production: send to observability service
    // (placeholder for future integration)
  },
  
  debug(data) { this._log('debug', data); },
  info(data) { this._log('info', data); },
  warn(data) { this._log('warn', data); },
  error(data) { this._log('error', data); },
  fatal(data) { this._log('fatal', data); }
};
```

### 3. Testing Vanilla JavaScript Without a Framework

#### The Micro-Framework Approach

From [alexwlchan.net: Testing JavaScript without a framework](https://alexwlchan.net/2023/testing-javascript-without-a-framework/):

**Core concept:** Use the browser itself as the test runner. Tests are HTML files that execute when loaded, displaying results directly in the browser.

**The test harness (10 lines):**
```javascript
function it(description, body_of_test) {
  const result = document.createElement('p');
  result.classList.add('test_result');

  try {
    body_of_test();
    result.classList.add('success');
    result.innerHTML = '✓ ' + description;
  } catch (error) {
    result.classList.add('failure');
    result.innerHTML = `✗ ${description}<br/><pre>${error}</pre>`;
  }

  document.body.appendChild(result);
}

function assertEqual(x, y) {
  if (x !== y) throw new Error(`${x} != ${y}`);
}
```

**Writing tests:**
```javascript
it('torus generates correct point count', () => {
  const points = generateTorusPoints(100, 200, 50);
  assertEqual(points.length, 100);
});

it('preset application updates all controls', () => {
  applyPreset('minimal');
  assertEqual(getSliderValue('points'), 100);
  assertEqual(getSliderValue('glow'), 0);
});
```

**Running tests:** Open the HTML file in a browser. No build step, no npm dependencies.

**Benefits:**
- Works with vanilla JS immediately
- No configuration required
- Visual feedback in browser
- Can test DOM manipulation directly
- Ideal for ~50-500 line codebases

#### Alternative: Vanilla-Test

For more structure, [vanilla-test](https://github.com/RIAEvangelist/vanilla-test) provides a minimalistic pure ES6 module that works in node, electron, and browser environments with no build step.

#### Testing Canvas Rendering

Canvas content is traditionally hard to test because "internal Canvas elements are not exposed through standard accessibility trees or selector-based approaches" ([AskUI: HTML5 Canvas Testing](https://www.askui.com/blog-posts/html5-canvas-testing-techniques-tools-and-best-practices)).

**Practical approaches for LEARNable Labs:**

1. **Test logic, not pixels:**
   - Test parametric equations (sphere, torus point generation)
   - Test CA stepping logic (Game of Life rules, Wolfram transitions)
   - Test UI state management (preset application, slider updates)
   
2. **Visual regression (future):**
   - Capture canvas.toDataURL() and compare hashes
   - Use tools like Playwright for visual snapshots
   - Not essential for initial test coverage

3. **Mock canvas context:**
   ```javascript
   const mockCanvas = {
     getContext: () => ({
       fillRect: () => {},
       arc: () => {},
       fill: () => {}
       // Record method calls for assertions
     })
   };
   ```

### 4. Vanilla JavaScript Renaissance (2026 Context)

The search results reveal a strong trend toward **no-build workflows** in 2026:

- "Developers are ditching frameworks for vanilla JavaScript" ([The New Stack](https://thenewstack.io/why-developers-are-ditching-frameworks-for-vanilla-javascript/))
- Native ES modules eliminate the need for bundlers in many cases
- Browser APIs have matured (IntersectionObserver, fetch, async/await)
- Build complexity is now seen as technical debt for suitable projects

**LEARNable Labs is well-positioned** — it already embraces this approach with no build step and vanilla architecture.

### 5. Lightweight Testing Tools (2026)

From search results ([TestDino: JavaScript Testing Frameworks 2026](https://testdino.com/blog/javascript-testing-frameworks)):

**Modern recommendations:**
- **Vitest**: "Strongest choice for modern projects" (but requires Vite setup)
- **Jest**: "Safe for legacy codebases" (but requires npm install + config)
- **Playwright**: E2E testing with visual snapshots
- **Browser DevTools**: Work directly with vanilla JS

**For no-build projects:** Custom micro-frameworks or vanilla-test are most aligned with the project philosophy.

---

## Prior Knowledge (Archive)

No archive sources found. This is the first factory run on this project.

**Recommendation:** After this cycle, archive findings on:
- Canvas animation error handling patterns
- Structured logging for client-side apps
- No-build testing approaches
- Observability implementation for vanilla JS

---

## Recommended Focus Areas

Ranked by expected impact on eval scores and project quality:

### 1. **Add Global Error Handlers & Structured Logging** (High Impact)
**Target dimension:** Observability (0.0 → 0.8+)

**Why this is #1:**
- Directly addresses the 0.0 observability score
- Prevents silent canvas freezes (critical user-facing issue)
- Easy to implement (global handlers + logger module)
- High weight in eval (0.10)

**Implementation approach:**
- Add Logger module to index.js (50-80 lines)
- Install global error handlers at top of IIFE
- Add structured logging to all major modules:
  - ShapeRenderer: log shape switches, render errors, performance warnings
  - CASimulator: log CA initialization, tick errors
  - BackgroundParticles: log particle system errors
  - ScrollReveal: log observation setup, reveal triggers
  - UIController: log preset changes, control updates
- Use log levels appropriately (debug for detail, error for failures)
- Include browser context in error logs

**Expected eval improvement:**
- observability: 0.0 → 0.8 (80%+ functions with logging, error handlers present)
- Composite score: 0.48 → 0.55

### 2. **Add Lightweight Test Suite** (High Impact)
**Target dimension:** Tests (0.5 → 1.0)

**Why this is #2:**
- Tests dimension currently undetected (0.5 = missing)
- Micro-framework approach aligns with no-build philosophy
- Can test core logic without touching rendering
- Establishes foundation for future changes

**Implementation approach:**
- Create `tests/` directory with HTML test files
- Add micro test framework (tests/framework.js, ~20 lines)
- Write tests for:
  - Parametric equation point generation (sphere, torus, helix)
  - CA logic (Game of Life neighbor counting, Wolfram rule application)
  - UI state management (preset application, slider mapping)
  - Configuration validation (bounds checking)
- Update eval/score.py to detect tests/ directory
- Add tests dimension to eval_profile.json

**Expected eval improvement:**
- tests: 0.5 → 1.0 (test suite exists and passes)
- Composite score: 0.55 → 0.60

### 3. **Add User-Facing Error Recovery** (Medium Impact)
**Target dimension:** Capability Surface (0.08 → 0.5+)

**Why this is #3:**
- Improves user experience when errors occur
- Demonstrates graceful degradation
- Builds on observability infrastructure (#1)
- Shows professional polish

**Implementation approach:**
- Add error boundary for animation loop (try/catch in requestAnimationFrame)
- Display user-friendly error messages in UI:
  - Canvas overlay with error state
  - "Reset" button to recover from errors
  - "Report Issue" link with error details
- Fallback behaviors:
  - If shape render fails, fall back to simple circle
  - If CA fails to initialize, disable CA visualization
  - If controls fail, provide manual JSON config input
- Add debug mode toggle (verbose logging to console)

**Expected eval improvement:**
- capability_surface: 0.08 → 0.5
- Composite score: 0.60 → 0.64

### 4. **Add ESLint Configuration** (Low-Medium Impact)
**Target dimension:** Lint (0.5 → 1.0)

**Why this is #4:**
- Lint dimension currently undetected
- ESLint works with vanilla JS (no build required)
- Catches common errors and enforces style
- Lower priority than observability and testing

**Implementation approach:**
- Add .eslintrc.json (browser env, ES6)
- Run via `npx eslint index.js` (no install required)
- Fix any issues found
- Update eval/score.py to run eslint

**Trade-off:** This adds a dev dependency (eslint), which slightly conflicts with no-build philosophy. Consider as optional enhancement.

**Expected eval improvement:**
- lint: 0.5 → 1.0
- Composite score: 0.64 → 0.68

### 5. **Add JSDoc Type Annotations** (Low Impact)
**Target dimension:** Type Check (0.5 → 0.7)

**Why this is #5:**
- Type checking dimension currently undetected
- JSDoc provides types without TypeScript build step
- Can be checked with `tsc --allowJs --checkJs --noEmit`
- Lowest priority (TypeScript not core to vanilla JS philosophy)

**Implementation approach:**
- Add JSDoc comments to module interfaces
- Check with TypeScript compiler (if available)
- Or just use for documentation (no checking)

**Expected eval improvement:**
- type_check: 0.5 → 0.7
- Composite score: 0.68 → 0.70

---

## Implementation Priority Matrix

| Focus Area | Dimension | Impact | Effort | Priority |
|------------|-----------|--------|--------|----------|
| Global error handlers + structured logging | observability | High | Low | **P0** |
| Micro-framework test suite | tests | High | Medium | **P0** |
| User-facing error recovery | capability_surface | Medium | Medium | **P1** |
| ESLint configuration | lint | Medium | Low | **P2** |
| JSDoc type annotations | type_check | Low | Medium | **P3** |

**Recommended first cycle focus:** P0 items (error handlers + logging + tests) will take composite score from 0.48 → 0.60 and establish observability foundation.

---

## Cross-Cutting Recommendations

### Maintain No-Build Philosophy

All recommendations preserve the vanilla architecture:
- Error handlers are pure JavaScript
- Logger is a simple module (no dependencies)
- Tests run in browser (no test runner)
- ESLint is optional dev tool (not runtime)

**Guard against:** Do not add bundlers, transpilers, or frameworks. The 2026 trend toward vanilla JS validates this approach.

### Browser Compatibility

Test error handlers across browsers:
- Chrome/Edge (Blink)
- Firefox (Gecko)
- Safari (WebKit)

Error behavior varies — verify both error types (synchronous + async) in all browsers.

### Performance Considerations

Structured logging can impact performance if overused. Recommendations:
- Use `debug` level for verbose logs (disable in production)
- Batch logs to avoid console spam
- Avoid logging in hot loops (requestAnimationFrame)
- Log state changes, not every frame

### Future Enhancements

After observability + tests are established:
- Performance monitoring (FPS tracking, render time)
- User analytics (shape usage, preset preferences)
- Visual regression tests (canvas snapshot comparison)
- OpenTelemetry integration (if app becomes more complex)

---

## Sources

### Error Handling & Observability
- [Best Practices for Error Logging in JavaScript](https://blog.openreplay.com/best-practices-error-logging-javascript/)
- [JavaScript Error Handling in 2026: A Comprehensive Guide](https://www.sencha.com/blog/a-comprehensive-guide-to-step-by-step-error-handling-in-javascript/)
- [Crash Reporting for JavaScript Canvas Games](https://bugnet.io/blog/crash-reporting-for-javascript-canvas-games)
- [Client-side Observability](https://medium.com/@ASHISHKUMAR256/client-side-observability-b3b8931f83a7)
- [Frontend Observability: Complete Guide](https://www.iron-out.io/frontend-observability/)
- [Choosing a JavaScript Logging Library: The 2026 Definitive Guide](https://blog.sentry.io/javascript-logging-library-definitive-guide/)

### Testing Vanilla JavaScript
- [Testing JavaScript without a (third-party) framework](https://alexwlchan.net/2023/testing-javascript-without-a-framework/)
- [GitHub - vanilla-test](https://github.com/RIAEvangelist/vanilla-test)
- [Testing HTML5 Canvas Techniques](https://www.askui.com/blog-posts/html5-canvas-testing-techniques-tools-and-best-practices)
- [JavaScript Testing Frameworks You Must Know in 2026](https://testdino.com/blog/javascript-testing-frameworks)

### Vanilla JavaScript Trends (2026)
- [Why Developers Are Ditching Frameworks for Vanilla JavaScript](https://thenewstack.io/why-developers-are-ditching-frameworks-for-vanilla-javascript/)
- [The Lightweight JavaScript Framework Renaissance of 2026](https://dev.to/eugenioenko/the-lightweight-javascript-framework-renaissance-of-2026-4ee0)
- [Building Lightweight Tools Without Frameworks](https://getconvertor.com/building-lightweight-tools-without-frameworks-vanilla-js-for-everyday-tasks/)

### Additional Context
- [MDN: Control flow and error handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [MDN: Canvas API Basic animations](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_animations)

---

## Next Steps for Strategist

1. **Read this research report** to understand external best practices
2. **Prioritize hypotheses** based on recommended focus areas (prioritize P0)
3. **Consider backlog** (currently empty) — these are net-new opportunities
4. **Target growth dimension** (observability is both hygiene AND growth)
5. **Respect hypothesis budget** (max 2 new items, min 1 growth)

**Strategic insight:** The observability dimension is unique — it's both a hygiene fix (0.0 → acceptable) AND a growth opportunity (capability_surface, user experience). A well-designed error handling + logging system will unlock multiple eval improvements and set foundation for future enhancements.
