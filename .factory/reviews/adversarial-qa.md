# Adversarial QA — H2: CLI-Runnable Unit Tests

- **Timestamp:** 2026-08-19
- **Detected project type:** Library (vanilla JS, no build step)
- **Hypothesis:** H2 — Extract pure functions to lib/core.js and add CLI-runnable unit tests
- **Scope source:** `.factory/strategy/current.md` H2 "What" field

---

## Smoke Test

**Command:** `node --check index.js`
**Output:** (clean exit, no output)
**Exit code:** 0
**Result:** PASS

---

## Acceptance Criteria Verification

### 1. lib/core.js exports work in Node.js (require works)

**Status:** VERIFIED

**Command:**
```
node -e "const core = require('./lib/core.js'); console.log('Exports:', Object.keys(core)); for (const [k,v] of Object.entries(core)) { console.log('  ' + k + ': ' + typeof v); }"
```

**Output:**
```
Exports: [ 'torusPoint', 'spherePoint', 'helixPoint', 'perspectiveScale', 'countLifeNeighbors', 'applyWolframRule' ]
Type of each:
  torusPoint: function
  spherePoint: function
  helixPoint: function
  perspectiveScale: function
  countLifeNeighbors: function
  applyWolframRule: function
```

**Evidence:** All 6 functions exported and callable via `require()`. The UMD pattern (`module.exports` in Node, `window.Core` in browser) works correctly.

---

### 2. index.js still has valid syntax (node --check)

**Status:** VERIFIED

**Command:**
```
node --check index.js
```

**Output:** (no output — clean exit)
**Exit code:** 0

**Evidence:** Node.js syntax checker confirms no parse errors after function extraction.

---

### 3. All 32 tests pass (node --test tests/core.test.js)

**Status:** VERIFIED

**Command:**
```
node --test tests/core.test.js
```

**Output (summary):**
```
TAP version 13
# tests 32
# suites 6
# pass 32
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 53.03
```

**Exit code:** 0

**Evidence:** 32 tests across 6 suites (torusPoint: 4, spherePoint: 3, helixPoint: 3, perspectiveScale: 5, countLifeNeighbors: 5, applyWolframRule: 12). All pass. Zero failures, zero skips. Uses Node.js built-in `node:test` runner — zero external dependencies.

---

### 4. eval/score.py tests dimension scores 1.0

**Status:** VERIFIED

**Command:**
```
python3 eval/score.py
```

**Output (tests dimension):**
```json
{
  "name": "tests",
  "score": 1.0,
  "weight": 0.15,
  "passed": true,
  "details": "All tests passed"
}
```

**All dimension scores:**
```
js_syntax: 1.0
html_structure: 0.875
css_validity: 1.0
code_modularity: 0.775
feature_completeness: 1.0
observability: 1.0
tests: 1.0
```

**Evidence:** The `tests` dimension scores exactly 1.0. The eval script runs `node --test tests/` internally and confirms all tests pass. No regressions from H1 — observability still 1.0, all other dimensions stable.

---

### 5. Extracted functions in lib/core.js match what was removed from index.js

**Status:** VERIFIED

**Commands:**
```bash
# Check index.js calls Core.* (uses extracted functions):
grep -n 'Core\.' index.js

# Check index.js does NOT redefine extracted functions:
grep -n 'function torusPoint\|function spherePoint\|...' index.js
```

**Output (calls in index.js — 8 call sites):**
```
331:  return Core.torusPoint(t, idx, majorR, minorR, rotSpeed, frame, cx, cy);
333:  return Core.spherePoint(t, idx, majorR, rotSpeed, frame, cx, cy);
360:  return Core.helixPoint(t, majorR, minorR, rotSpeed, frame, cx, cy);
535:  const persp = Core.perspectiveScale(800, rpz);
567:  const persp = Core.perspectiveScale(800, pz);
589:  const perspective = Core.perspectiveScale(800, pos.z);
630:  const neighbors = Core.countLifeNeighbors(state.lifeGrid, x, y, gs);
672:  next[i] = Core.applyWolframRule(left, center, right, rule);
```

**Output (duplicate definitions search):** No matches (exit code 1 — grep found nothing).

**lib/core.js structure verified:**
- UMD wrapper: `(function(root) { ... })(typeof window !== 'undefined' ? window : this)`
- Node path: `if (typeof module !== 'undefined' && module.exports) module.exports = Core`
- Browser path: `else root.Core = Core`
- 6 pure functions: torusPoint, spherePoint, helixPoint, perspectiveScale, countLifeNeighbors, applyWolframRule

**Evidence:** index.js calls all 6 functions via `Core.*` (8 call sites). Zero duplicate definitions exist in index.js — the functions were cleanly extracted, not copy-pasted.

---

### 6. index.html includes lib/core.js script tag before index.js

**Status:** VERIFIED

**Command:**
```
grep -n 'script.*src.*lib/core\|script.*src.*index' index.html
```

**Output:**
```
110:<script src="lib/core.js"></script>
111:<script src="index.js"></script>
```

**Evidence:** lib/core.js is loaded on line 110, index.js on line 111. Correct ordering ensures `Core` global is available when index.js executes.

---

## Edge Case Tests

### UMD pattern correctness
**Verified:** lib/core.js uses a proper UMD wrapper. Lines 65-68 handle Node.js (`module.exports`) vs browser (`root.Core`) correctly. Line 71 detects the root object via `typeof window`.

### No npm dependencies introduced
**Verified:** No `package.json` exists. Tests use `node:test` and `node:assert` (Node.js built-ins only). Zero external dependencies — preserves the no-build philosophy per H2 spec.

### No duplicate function implementations
**Verified:** `grep` for function definitions of the 6 extracted names in index.js returns zero matches. The functions exist only in lib/core.js.

---

## Process Cleanup

No server processes, tmux sessions, or background processes were started during testing. No cleanup needed.

---

## Summary

| # | Criterion | Status |
|---|-----------|--------|
| 1 | lib/core.js exports work via require() | VERIFIED |
| 2 | index.js valid syntax | VERIFIED |
| 3 | All 32 tests pass | VERIFIED |
| 4 | eval/score.py tests dimension = 1.0 | VERIFIED |
| 5 | Extracted functions match, no duplicates | VERIFIED |
| 6 | Script tag ordering correct | VERIFIED |

---

## Adversarial Verdict: **PASS**

All 6 acceptance criteria verified with command + output evidence. No regressions detected. The extraction is clean (no duplicate code), the UMD pattern works in both environments, and the test suite is comprehensive (32 tests, 6 suites, zero dependencies).
