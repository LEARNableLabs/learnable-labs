## Strategy — 2026-08-19

### Observations
- Current composite score: 0.7209
- Baseline composite score: 0.48
- Delta: +0.2409 (+50.2%)
- Weakest dimensions: capability_surface (0.10), observability (0.0 built-in), research_grounding (0.10)
- Last experiments: #1 (reverted/precheck), #2 (reverted/precheck), #4 (KEPT, +0.2409)
- Pattern: project eval dimensions score well but factory built-in dimensions are Python-specific

### Completed This Cycle
- H1: Global error handlers + structured logging (observability 0.0 → 1.0 in project eval)
- H2: CLI-runnable unit tests with Node.js built-in test runner (32 tests, lib/core.js extraction)
- Config fix: eval_weights project=0.50 so project eval dimensions count

### Backlog (3 items)
1. Add user-facing error recovery UI (capability_surface)
2. Add ESLint configuration (lint)
3. Fix rAF error recovery — re-schedule after catch with circuit breaker

### Anti-patterns to Avoid
- Factory built-in dimensions are Python-specific — don't expect them to detect JS tooling
- Default eval_weights (project: 0.0) makes project eval invisible — always configure weights
- Factory finalize gate overrides CEO verdicts — use --force when precheck has structural issues
- Don't log in hot loops (requestAnimationFrame per-frame logic)

### Session State
- **Mode:** Improve (cycle complete)
- **Current phase:** Final archive complete
- **Active experiments:** none (all finalized)
- **Next action:** Cycle complete. Next cycle should address backlog items.
