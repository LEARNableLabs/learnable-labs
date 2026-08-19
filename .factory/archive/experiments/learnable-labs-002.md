---
tags: [factory, experiment, learnable-labs]
project: learnable-labs
experiment_id: 2
verdict: revert
score_delta: 0.0
date: 2026-08-19
source: factory-archivist
---

# Experiment #2: CLI-Runnable Unit Tests and lib/core.js Extraction

## Result
**REVERT** — hypothesis was sound, but eval gate blocked due to the same misconfigured eval weights (project dimension weight = 0.0). Changes were re-applied in Exp #4 after config fix and kept successfully.

## What Changed
- Extracted 6 pure functions to lib/core.js: point generation functions (torus, sphere, helix), perspective projection, cellular automata neighbor counting, and Wolfram rule application
- Added 32 unit tests using Node.js built-in test runner (node:test + node:assert, zero dependencies)
- Tests cover pure functions, CA step logic, Wolfram rule application, and projection mathematics
- Updated eval/score.py to include tests dimension for JavaScript projects

## What We Learned
The factory's built-in tests dimension only detected unit tests after we explicitly added it to eval/score.py. Prior eval runs saw tests dimension score as 0.5 (not detected) for JavaScript. Extracting pure functions before writing tests reduced coupling and made tests cleaner — hypothesis confirmed. However, the eval config issue masked this improvement.

## Links
- Commit: 083ec8a (Extract pure functions to lib/core.js and add CLI-runnable unit tests)
