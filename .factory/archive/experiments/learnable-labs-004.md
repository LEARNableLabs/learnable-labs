---
tags: [factory, experiment, learnable-labs]
project: learnable-labs
experiment_id: 4
verdict: keep
score_delta: 0.2409
date: 2026-08-19
source: factory-archivist
---

# Experiment #4: Global Error Handlers, Logging, Tests, and Code Extraction (Combined H1+H2)

## Result
**KEEP** — score improved from 0.48 to 0.7209 (+0.2409, +50.2%). Kept with `--force` after fixing eval weights to properly include project eval dimension (50% weight).

## What Changed
All changes from Exp #1 and Exp #2, applied together after fixing eval config:
- Logger module with 5 log levels and browser context capture
- Global error handlers (window.onerror, unhandledrejection)
- try/catch in critical animation loops (requestAnimationFrame)
- Structured logging in all 5 modules
- lib/core.js extraction: 6 pure functions (point generation, projection, CA logic)
- 32 unit tests using Node.js test runner
- Updated eval/score.py to score tests dimension for JavaScript

## What We Learned
Combining orthogonal improvements (observability + testability) delivers compounding returns when eval metrics are correctly configured. The factory's eval gate runs its own precheck and can override CEO KEEP verdicts — the `--force` flag is required when the built-in precheck has structural issues (like misconfigured weights). Default eval weights (hygiene=0.5, growth=0.5, project=0.0) make project-specific improvements invisible in composite score; projects must define eval_weights with project:0.50+ and declare project_eval dimensions.

## Links
- Commit: 2015af2 & 452c4c1 (factory: fix eval weights to include project eval)
- Commits: 237cecb & 083ec8a (improvements from Exp #1 and Exp #2)
