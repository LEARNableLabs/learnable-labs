#!/usr/bin/env python3
"""Eval script for LEARNable Labs — vanilla HTML/CSS/JS web project.

Evaluates: JS syntax, HTML structure, CSS validity, code modularity,
feature completeness, and observability.

Output format:
    {"results": [{"name": str, "score": float, "weight": float, "passed": bool, "details": str}, ...]}
"""

import json
import re
import subprocess
import sys
from pathlib import Path


def eval_js_syntax() -> dict:
    """Verify index.js has no syntax errors via node --check."""
    name = "js_syntax"
    weight = 0.20
    try:
        result = subprocess.run(
            ["node", "--check", "index.js"],
            capture_output=True,
            text=True,
            timeout=30,
        )
        passed = result.returncode == 0
        score = 1.0 if passed else 0.0
        details = "No syntax errors" if passed else (result.stderr or result.stdout).strip()[:500]
        return {"name": name, "score": score, "weight": weight, "passed": passed, "details": details}
    except FileNotFoundError:
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "node not found on PATH"}
    except subprocess.TimeoutExpired:
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "Timed out after 30s"}


def eval_html_structure() -> dict:
    """Check index.html for required structural elements."""
    name = "html_structure"
    weight = 0.15

    html_path = Path("index.html")
    if not html_path.exists():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.html not found"}

    html = html_path.read_text(errors="replace")

    required = {
        "nav": bool(re.search(r"<nav[\s>]", html, re.IGNORECASE)),
        "canvas": bool(re.search(r"<canvas[\s>]", html, re.IGNORECASE)),
        "section_research": bool(re.search(r'id\s*=\s*["\']?research', html, re.IGNORECASE)),
        "section_method": bool(re.search(r'id\s*=\s*["\']?method', html, re.IGNORECASE)),
        "section_product": bool(re.search(r'id\s*=\s*["\']?product', html, re.IGNORECASE)),
        "section_team": bool(re.search(r'id\s*=\s*["\']?team', html, re.IGNORECASE)),
        "controls_panel": bool(re.search(r'id\s*=\s*["\']?controls|class\s*=\s*["\'][^"\']*controls', html, re.IGNORECASE)),
        "prompt_bar": bool(re.search(r'id\s*=\s*["\']?prompt|class\s*=\s*["\'][^"\']*prompt', html, re.IGNORECASE)),
    }

    found = sum(required.values())
    total = len(required)
    score = round(found / total, 3)
    present = [k for k, v in required.items() if v]
    missing = [k for k, v in required.items() if not v]

    details = f"Found {found}/{total}: {', '.join(present) if present else 'none'}"
    if missing:
        details += f" | Missing: {', '.join(missing)}"

    return {"name": name, "score": score, "weight": weight,
            "passed": score >= 0.5, "details": details}


def eval_css_validity() -> dict:
    """Check index.css exists, is non-empty, and has balanced braces."""
    name = "css_validity"
    weight = 0.10

    css_path = Path("index.css")
    if not css_path.exists():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.css not found"}

    css = css_path.read_text(errors="replace")
    if not css.strip():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.css is empty"}

    score = 1.0
    issues = []

    open_braces = css.count("{")
    close_braces = css.count("}")
    if open_braces != close_braces:
        score -= 0.5
        issues.append(f"unbalanced braces: {open_braces} open vs {close_braces} close")

    empty_rules = len(re.findall(r"\{\s*\}", css))
    if empty_rules > 0:
        score -= min(0.25, empty_rules * 0.05)
        issues.append(f"{empty_rules} empty rule(s)")

    unclosed_strings = 0
    for line in css.splitlines():
        stripped = line.strip()
        if stripped.count('"') % 2 != 0 or stripped.count("'") % 2 != 0:
            unclosed_strings += 1
    if unclosed_strings > 0:
        score -= min(0.25, unclosed_strings * 0.05)
        issues.append(f"{unclosed_strings} line(s) with unclosed quotes")

    score = max(0.0, round(score, 3))
    details = f"{len(css.splitlines())} lines, {open_braces} rules"
    if issues:
        details += f" | Issues: {'; '.join(issues)}"

    return {"name": name, "score": score, "weight": weight,
            "passed": score >= 0.5, "details": details}


def eval_code_modularity() -> dict:
    """Analyze index.js for modular structure."""
    name = "code_modularity"
    weight = 0.20

    js_path = Path("index.js")
    if not js_path.exists():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.js not found"}

    js = js_path.read_text(errors="replace")
    lines = js.splitlines()

    expected_modules = ["ShapeRenderer", "CASimulator", "BackgroundParticles",
                        "ScrollReveal", "UIController"]
    found_modules = [m for m in expected_modules if re.search(rf"\b{m}\b\s*[=:]", js)]

    func_decls = re.findall(r"(?:function\s+(\w+)|(\w+)\s*:\s*function|(\w+)\s*=\s*function|(\w+)\s*=\s*\([^)]*\)\s*=>)", js)
    func_count = len(func_decls)

    func_lengths = []
    func_line_pattern = re.compile(r"(?:function\s+\w+|[\w.]+\s*[:=]\s*function|\w+\s*[:=]\s*\([^)]*\)\s*=>)")
    brace_depth = 0
    in_func = False
    func_start = 0
    for i, line in enumerate(lines):
        if not in_func and func_line_pattern.search(line):
            in_func = True
            func_start = i
            brace_depth = 0
        if in_func:
            brace_depth += line.count("{") - line.count("}")
            if brace_depth <= 0 and i > func_start:
                func_lengths.append(i - func_start + 1)
                in_func = False

    score = 0.0
    module_score = 0.4 if len(found_modules) >= 5 else len(found_modules) / 5 * 0.4
    func_score = 0.3 if func_count >= 20 else func_count / 20 * 0.3
    avg_len = sum(func_lengths) / len(func_lengths) if func_lengths else 999
    length_score = 0.3 if avg_len < 50 else max(0.0, 0.3 * (1.0 - (avg_len - 50) / 100))

    score = round(module_score + func_score + length_score, 3)

    details = (f"modules={len(found_modules)}/5 ({', '.join(found_modules)}), "
               f"functions={func_count}, "
               f"avg_func_length={avg_len:.0f} lines")

    return {"name": name, "score": score, "weight": weight,
            "passed": score >= 0.5, "details": details}


def eval_feature_completeness() -> dict:
    """Check index.js for key feature markers."""
    name = "feature_completeness"
    weight = 0.25

    js_path = Path("index.js")
    if not js_path.exists():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.js not found"}

    js = js_path.read_text(errors="replace")

    features = {
        "ShapeRenderer": bool(re.search(r"\bShapeRenderer\b", js)),
        "CASimulator": bool(re.search(r"\bCASimulator\b", js)),
        "BackgroundParticles": bool(re.search(r"\bBackgroundParticles\b", js)),
        "ScrollReveal": bool(re.search(r"\bScrollReveal\b|IntersectionObserver", js)),
        "UIController": bool(re.search(r"\bUIController\b", js)),
        "mouse_interaction": bool(re.search(r"mousemove|mousedown|mouseup", js)),
        "animation_loop": bool(re.search(r"requestAnimationFrame", js)),
    }

    found = sum(features.values())
    total = len(features)
    score = round(found / total, 3)
    present = [k for k, v in features.items() if v]
    missing = [k for k, v in features.items() if not v]

    details = f"Found {found}/{total}: {', '.join(present)}"
    if missing:
        details += f" | Missing: {', '.join(missing)}"

    return {"name": name, "score": score, "weight": weight,
            "passed": score >= 0.5, "details": details}


def eval_observability() -> dict:
    """Check for logging and error handling in index.js."""
    name = "observability"
    weight = 0.10

    js_path = Path("index.js")
    if not js_path.exists():
        return {"name": name, "score": 0.0, "weight": weight, "passed": False,
                "details": "index.js not found"}

    js = js_path.read_text(errors="replace")

    score = 0.0
    findings = []

    log_calls = re.findall(r"console\.(log|warn|error|info|debug)\s*\(", js)
    if log_calls:
        score += 0.5
        findings.append(f"{len(log_calls)} console calls")
    else:
        findings.append("no console logging")

    try_catch = re.findall(r"\btry\s*\{", js)
    if try_catch:
        score += 0.25
        findings.append(f"{len(try_catch)} try/catch blocks")
    else:
        findings.append("no try/catch")

    structured_logs = re.findall(r"console\.\w+\s*\(\s*['\"`][^'\"]*['\"`]\s*,\s*[\[{]", js)
    if structured_logs:
        score += 0.25
        findings.append(f"{len(structured_logs)} structured log(s)")
    else:
        template_logs = re.findall(r"console\.\w+\s*\(\s*`[^`]*\$\{", js)
        if template_logs:
            score += 0.25
            findings.append(f"{len(template_logs)} template literal log(s)")
        else:
            findings.append("no structured data in logs")

    score = round(score, 3)
    return {"name": name, "score": score, "weight": weight,
            "passed": score >= 0.25, "details": "; ".join(findings)}


EVALS = [
    eval_js_syntax,
    eval_html_structure,
    eval_css_validity,
    eval_code_modularity,
    eval_feature_completeness,
    eval_observability,
]


def main() -> None:
    results = [fn() for fn in EVALS]
    output = {"results": results}
    json.dump(output, sys.stdout, indent=2)
    print()


if __name__ == "__main__":
    main()
