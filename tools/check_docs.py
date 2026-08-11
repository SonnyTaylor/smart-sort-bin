#!/usr/bin/env python3
"""Catch documentation that has drifted away from the repo.

Docs rot silently. This finds the three ways it has actually happened here:

  1. A link points at a file that was renamed or deleted.
  2. A doc mentions a file path in backticks that no longer exists.
  3. The same command is written out in several docs, so they disagree the
     moment one is updated.

    python tools/check_docs.py

Exits non-zero if anything is wrong, so it can gate a commit. Run it after
moving, renaming or deleting anything.
"""

import os
import re
import sys
from collections import defaultdict

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP_DIRS = {".git", "node_modules", ".venv", "__pycache__", ".pio", "build",
             "raw", "src", "logs", "old", "feedback", ".ruff_cache"}

LINK = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
CODE = re.compile(r"`([^`\n]+)`")
FENCE = re.compile(r"^```")

# A backticked string is treated as a repo path only if it starts with a real
# top-level directory or carries a file extension. Without this, code like
# `set_pan/set_tilt` gets mistaken for a path.
TOP_LEVEL = ("src/", "cad/", "docs/", "tools/", "portfolio/")
PATH_LIKE = re.compile(r"^[\w./-]+/[\w./-]+$")
HAS_EXT = re.compile(r"\.[A-Za-z0-9]{1,5}$")
# Commands worth checking for duplication across docs.
COMMAND = re.compile(r"^\s*(python|python3|bun|npm|node|uv|pwsh|\./)\b")


def markdown_files():
    for root, dirs, files in os.walk(REPO):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fn in sorted(files):
            if fn.endswith(".md"):
                yield os.path.join(root, fn)


def rel(path):
    return os.path.relpath(path, REPO).replace(os.sep, "/")


def check():
    problems = []
    commands = defaultdict(set)
    checked_links = checked_paths = 0

    for path in markdown_files():
        here = os.path.dirname(path)
        in_fence = False
        with open(path, encoding="utf-8") as f:
            lines = f.readlines()

        for n, line in enumerate(lines, 1):
            if FENCE.match(line):
                in_fence = not in_fence
                continue

            if in_fence:
                if COMMAND.match(line):
                    commands[" ".join(line.split()).split("#")[0].strip()].add(rel(path))
                continue

            for target in LINK.findall(line):
                if target.startswith(("http://", "https://", "mailto:", "#")):
                    continue
                target = target.split("#")[0].strip()
                if not target:
                    continue
                checked_links += 1
                if not os.path.exists(os.path.join(here, target)):
                    problems.append("%s:%d  broken link  ->  %s"
                                    % (rel(path), n, target))

            for span in CODE.findall(line):
                span = span.strip()
                if not PATH_LIKE.match(span):
                    continue
                if not (span.startswith(TOP_LEVEL) or HAS_EXT.search(span)):
                    continue
                # Absolute and remote paths are not ours to verify.
                if span.startswith(("/", "~", "http")) or span.startswith(".pio"):
                    continue
                if any(part in span for part in ("<", ">", "*", "dev/", "etc/",
                                                 "home/", "usr/", "var/", "proc/")):
                    continue
                checked_paths += 1
                candidates = [os.path.join(REPO, span), os.path.join(here, span)]
                if not any(os.path.exists(c) for c in candidates):
                    problems.append("%s:%d  path does not exist  ->  %s"
                                    % (rel(path), n, span))

    duplicated = {cmd: files for cmd, files in commands.items() if len(files) > 1}

    print("%d links and %d file paths checked across %d documents."
          % (checked_links, checked_paths, len(list(markdown_files()))))

    if problems:
        print("\n%d broken reference(s):" % len(problems))
        for p in problems:
            print("  " + p)

    if duplicated:
        print("\n%d command(s) written out in more than one document. Keep one "
              "copy and link to it, or they will disagree:" % len(duplicated))
        for cmd, files in sorted(duplicated.items()):
            print("  %s" % cmd)
            for f in sorted(files):
                print("      %s" % f)

    if not problems and not duplicated:
        print("No problems found.")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(check())
