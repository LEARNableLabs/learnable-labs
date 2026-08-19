# Factory Configuration
<!-- This file configures the Remote Factory for your project. -->
<!-- The factory reads this during Init mode and generates .factory/config.json from it. -->
<!-- Fill in each section below. -->

## Goal

Interactive animation playground and landing page for LEARNable Labs ed-tech venture

## Scope

### Modifiable
<!-- Files and directories the factory is allowed to create or edit. -->
<!-- One path per line. Glob patterns are supported. -->

- index.html
- index.js
- index.css
- LEARNABLE.md
- eval/**

### Read-only
<!-- Files the factory may read but must never modify. -->

- CLAUDE.md
- factory.md

## Guards
<!-- Rules the factory must never violate. Checked before every commit. -->

- Do not delete or overwrite existing tests
- Do not modify files outside the declared scope
- Do not introduce secrets or credentials into the repository
- Do not remove existing animation features
- Do not add build dependencies or frameworks
- Do not break the single-page vanilla architecture

## Eval

### Command
<!-- The shell command the factory runs to score a change. -->
<!-- It must output JSON to stdout matching the EvalResult format. -->

```bash
python3 eval/score.py
```

### Threshold
<!-- Minimum composite score (0.0-1.0) required to keep a change. -->

0.70

## Target Branch

main

## Project Eval

js_syntax
html_structure
css_validity
code_modularity
feature_completeness
observability
tests

## Eval Weights

hygiene: 0.25
growth: 0.25
project: 0.50

## Hypothesis Budget
<!-- Controls how many hypotheses the Strategist generates per cycle. -->

- min_growth: 1
- max_new: 2

## Smoke Test
<!-- Optional e2e smoke test command. Failure = mandatory revert. -->

```bash
node --check index.js && python3 -c "import json,subprocess; r=json.loads(subprocess.check_output(['python3','eval/score.py'])); assert all(d['passed'] for d in r['results'] if d['weight']>0.1)"
```

## Test Timeout

300

## Constraints
<!-- Soft rules that guide behavior but don't block commits. -->

- Prefer small, incremental changes over large rewrites
- Maintain the vanilla HTML/CSS/JS architecture with no build step
- Follow the existing code style and conventions
- Keep the single-page app structure intact
