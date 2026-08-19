---
tags: [factory, experiment, learnable-labs]
project: learnable-labs
experiment_id: 1
verdict: revert
score_delta: 0.0
date: 2026-08-19
source: factory-archivist
---

# Experiment #1: Global Error Handlers and Structured Logging

## Result
**REVERT** — hypothesis was sound, but eval gate blocked due to misconfigured eval weights (project dimension weight = 0.0). Changes were re-applied in Exp #4 after config fix and kept successfully.

## What Changed
- Added Logger module with 5 log levels (debug, info, warn, error, fatal)
- Added global error handlers: `window.onerror` and `unhandledrejection`
- Added try/catch wrappers in requestAnimationFrame callbacks (ShapeRenderer.draw, BackgroundParticles.animate)
- Added structured logging statements to all 5 modules (ShapeRenderer, CASimulator, BackgroundParticles, ScrollReveal, UIController)
- Captured browser context (userAgent, screen, canvas dimensions) in log output

## What We Learned
Factory's built-in eval dimensions are Python-specific. JavaScript console logging is not detected by the default observability dimension scorer. This caused legitimate observability improvements to be invisible to the composite score. The eval config issue (project_eval weight = 0.0) made project-specific improvements completely invisible, masking the real value of this change until config was fixed.

## Links
- Commit: 237cecb (Add global error handlers and structured logging to all modules)
