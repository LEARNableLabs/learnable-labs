# Health Check Report

- **Experiment:** H2 — CLI-runnable unit test suite
- **Timestamp:** 2026-08-19
- **Baseline:** 0.48
- **Threshold:** 0.70

---

## Score Table

| Dimension | Score | Weight | Passed | Details |
|---|---|---|---|---|
| tests (hygiene) | 0.50 | 0.041 | yes | Not detected by hygiene scanner |
| lint | 0.50 | 0.020 | yes | Not detected |
| type_check | 0.50 | 0.013 | yes | Not detected |
| coverage | 0.50 | 0.033 | yes | Not detected |
| config_parser | 1.00 | 0.013 | yes | All config checks OK |
| architecture | 0.50 | 0.012 | yes | Not detected |
| js_syntax (project) | 1.00 | 0.071 | yes | No syntax errors |
| html_structure (project) | 0.875 | 0.071 | yes | 7/8 elements found |
| css_validity (project) | 1.00 | 0.071 | yes | 629 lines, 85 rules |
| code_modularity (project) | 0.775 | 0.071 | yes | 5/5 modules, 5 functions |
| feature_completeness (project) | 1.00 | 0.071 | yes | 7/7 features found |
| observability (project) | 1.00 | 0.071 | yes | 5 console calls, 2 try/catch, 5 structured logs |
| tests (project) | 1.00 | 0.071 | yes | All tests passed |
| capability_surface | 0.10 | 0.063 | no | 10/100 surface |
| experiment_diversity | 0.50 | 0.050 | yes | Too few experiments to judge |
| observability (growth) | 0.00 | 0.045 | no | Growth scanner: 0.00 |
| research_grounding | 0.10 | 0.035 | no | 0 sources |
| factory_effectiveness | 0.50 | 0.033 | yes | Too few experiments to judge |
| spec_compliance | 0.50 | 0.025 | yes | Neutral |

---

## Composite Score

- **Composite:** 0.7209
- **Baseline:** 0.48
- **Delta:** +0.2409 (+50.2%)
- **Threshold (0.70):** PASSED

## Unit Tests

- **Status:** PASS
- **Runner:** `node --test tests/core.test.js`
- **Result:** 32 tests, 6 suites, 32 pass, 0 fail, 0 skipped
- **Duration:** 59ms

## Guard Violations

None.

---

## Overall Gate Result: PASS

Unit tests pass (32/32). Composite score 0.7209 is above both baseline (0.48) and threshold (0.70). No guard violations. No eval crashes.
