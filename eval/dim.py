#!/usr/bin/env python3
"""Extract a single eval dimension from score.py output by name."""
import json
import subprocess
import sys
from pathlib import Path

name = sys.argv[1]
script = str(Path(__file__).parent / "score.py")
raw = subprocess.check_output(["python3", script], cwd=str(Path(__file__).resolve().parent.parent))
results = json.loads(raw)["results"]
dim = next(d for d in results if d["name"] == name)
json.dump(dim, sys.stdout)
