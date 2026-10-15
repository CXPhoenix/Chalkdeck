#!/usr/bin/env python3
"""Check portable project instructions, per-runtime skill trees and native role configs.

Python 3.11+. Read-only and offline; run from any working directory.
This checks configuration structure, not model-backed workflow behavior.
"""

import hashlib
import json
import os
from pathlib import Path
import re
import sys
import tomllib


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ("research", "security-review", "tw-emoji-commit", "tw-emoji-pr-note", "tw-emoji-release-note", "evidence-report", "agent-browser", "i-have-adhd", "tune-skills")
SANITIZERS = (("tw-emoji-commit", "sanitize_commit.py"), ("tw-emoji-pr-note", "sanitize_pr_note.py"), ("tw-emoji-release-note", "sanitize_release_note.py"))


def verify(root):
    root = root.resolve()
    errors = []

    def check(condition, message):
        if not condition:
            errors.append(message)

    shared = root / "AGENTS.md"
    claude = root / "CLAUDE.md"
    check(shared.is_file(), "AGENTS.md is missing")
    check(claude.is_file() and "@AGENTS.md" in claude.read_text(encoding="utf-8"), "CLAUDE.md must import @AGENTS.md")
    uninitialized = shared.exists() and ("{{" + "PROJECT_NAME}}") in shared.read_text(encoding="utf-8")
    ignore = root / ".gitignore"
    ignored = ignore.read_text(encoding="utf-8").splitlines() if ignore.is_file() else []
    check(any(line.strip() in {"/.proj.handoffs/", ".proj.handoffs/"} for line in ignored), ".gitignore must exclude /.proj.handoffs/")

    # Each runtime owns an independent skill tree; contents may diverge.
    trees = {"Codex": root / ".agents/skills", "Claude": root / ".claude/skills"}
    # chalkdeck: open-slide's `pnpm sync:skills` keeps its skills (and other packaged ones) in
    # .agents/skills and links .claude/skills/<name> to them. Such shared skills are exempt from
    # the independent-copy checks; their SKILL.md frontmatter is still checked.
    shared = set()
    for link in trees["Claude"].iterdir() if trees["Claude"].exists() else ():
        if link.is_symlink() and Path(os.readlink(link)) == Path("..", "..", ".agents", "skills", link.name):
            check((trees["Codex"] / link.name / "SKILL.md").is_file(), f"Broken shared skill link: {link.name}")
            shared.add(link.name)
    policies = {}
    for runtime, skills_root in trees.items():
        check(not skills_root.is_symlink() and not skills_root.parent.is_symlink(), f"{runtime} skill root must be a real directory")
        # is_symlink: on Windows a directory link may not report is_dir.
        skills = sorted(p for p in skills_root.iterdir() if p.is_dir() or p.is_symlink()) if skills_root.exists() else []
        names = {p.name for p in skills}
        for name in REQUIRED:
            check(name in names, f"Required {runtime} skill is missing: {name}")
        if uninitialized:
            check("init-template" in names, f"Uninitialized template is missing {runtime} init-template")
        for name, helper in SANITIZERS:
            check((skills_root / name / "scripts" / helper).is_file(), f"Missing {runtime} sanitizer: {name}")
        policies[runtime] = {}
        for skill in skills:
            if skill.name not in shared:
                check(not skill.is_symlink(), f"{runtime} skill must be a real directory: {skill.name}")
            entry = skill / "SKILL.md"
            check(entry.is_file(), f"Missing {runtime} SKILL.md: {skill.name}")
            if not entry.is_file():
                continue
            parts = entry.read_text(encoding="utf-8").split("---", 2)
            header = parts[1] if len(parts) == 3 and not parts[0].strip() else ""
            match = re.search(r"^name:\s*([^\n]+)", header, re.M)
            check(bool(match) and match[1].strip().strip("\"'") == skill.name, f"{runtime} skill name/frontmatter mismatch: {skill.name}")
            check(bool(re.search(r"^description:\s*\S", header, re.M)), f"Missing {runtime} description: {skill.name}")
            claude_manual = bool(re.search(r"^disable-model-invocation:", header, re.M))
            metadata = skill / "agents/openai.yaml"
            if skill.name in shared:
                continue
            if runtime == "Codex":
                check(not claude_manual, f"Codex skill carries Claude-only frontmatter: {skill.name}")
                check(metadata.is_file(), f"Missing Codex metadata: {skill.name}")
                if metadata.is_file():
                    policies[runtime][skill.name] = bool(re.search(r"^\s+allow_implicit_invocation:\s*false\s*$", metadata.read_text(encoding="utf-8"), re.M))
            else:
                check(not metadata.exists(), f"Claude skill carries Codex-only metadata: {skill.name}")
                policies[runtime][skill.name] = bool(re.search(r"^disable-model-invocation:\s*true\s*$", header, re.M))
        for path in skills_root.rglob("*") if skills_root.exists() else ():
            if path.relative_to(skills_root).parts[0] in shared:
                continue
            check(not path.is_symlink(), f"Skill trees must not contain links: {path.relative_to(root)}")
            check(path.name not in {".DS_Store", "__pycache__"} and not path.name.endswith((".pyc", ".bak")), f"Local cache/backup was bundled: {path.relative_to(root)}")

    for name in policies["Codex"].keys() & policies["Claude"].keys():
        check(policies["Codex"][name] == policies["Claude"][name], f"Claude/Codex invocation policy differs: {name}")
    names = policies["Codex"].keys() | policies["Claude"].keys() | shared

    try:
        sources = json.loads((root / "docs/agents/skill-sources.json").read_text(encoding="utf-8"))
        for runtime, skills_root in trees.items():
            upstream = skills_root / "security-review/references/upstream-security-review.md"
            check(hashlib.sha256(upstream.read_bytes()).hexdigest() == sources["skills"]["security-review"]["upstream_sha256"], f"{runtime} security-review upstream snapshot differs from its recorded checksum")
            license_body = (skills_root / "security-review/LICENSE").read_text(encoding="utf-8")
            check("MIT License" in license_body, f"{runtime} security-review MIT license is missing")
    except (OSError, ValueError, KeyError) as error:
        errors.append(f"Skill provenance cannot be checked: {error}")

    try:
        config = tomllib.loads((root / ".codex/config.toml").read_text(encoding="utf-8"))
        check(config.get("sandbox_mode") == "workspace-write", "Unexpected Codex project sandbox default")
        for name in ("harness-reviewer", "harness-researcher"):
            role = tomllib.loads((root / f".codex/agents/{name}.toml").read_text(encoding="utf-8"))
            check(role.get("name") == name and bool(role.get("description")) and bool(role.get("developer_instructions")), f"Incomplete Codex role: {name}")
            check("model" not in role, f"Codex role unexpectedly pins a model: {name}")
            native = root / f".claude/agents/{name}.md"
            check(native.is_file() and f"name: {name}" in native.read_text(encoding="utf-8"), f"Missing Claude role: {name}")
    except (OSError, ValueError) as error:
        errors.append(f"Runtime configuration cannot be checked: {error}")

    errors.extend(check_glossary(root))
    return names, errors


STALE_GLOSSARY_TOKENS = ("CONTEXT.md", "CONTEXT-MAP.md", "CONTEXT-FORMAT.md")


def _markdown_files(top, skip):
    """Regular *.md files under top, not descending into directories named in skip."""
    found = []
    for directory, subdirs, names in os.walk(top):
        subdirs[:] = [d for d in subdirs if d not in skip]
        found.extend(Path(directory, n) for n in names if n.endswith(".md") and Path(directory, n).is_file())
    return found


def _glossary_scan_files(root):
    """The scanned set of .proj.specs/0001-glossary-rename/traceability.md."""
    claude = root / ".claude/skills"
    shared = {
        link.name for link in (claude.iterdir() if claude.is_dir() else ())
        if link.is_symlink() and Path(os.readlink(link)) == Path("..", "..", ".agents", "skills", link.name)
    }
    files = []
    for tree in (claude, root / ".agents/skills"):
        for skill in tree.iterdir() if tree.is_dir() else ():
            if skill.name not in shared and skill.is_dir() and not skill.is_symlink():
                files.extend(_markdown_files(skill, {"node_modules"}))
    files.extend(root / name for name in ("AGENTS.md", "CLAUDE.md", "docs/README.md") if (root / name).is_file())
    agents_docs = root / "docs/agents"
    if agents_docs.is_dir():
        files.extend(p for p in _markdown_files(agents_docs, set()) if "skill-tuning" not in p.relative_to(agents_docs).parts[:1])
    return files


def check_glossary(root):
    """Return one message per glossary-convention violation (see epic 0001-glossary-rename)."""
    messages = []
    glossary = root / "GLOSSARY.md"
    if glossary.is_symlink() or not glossary.is_file() or not glossary.read_bytes().strip():
        messages.append("GLOSSARY.md is missing, not a regular file, or blank")
    # Exact names from directory listings, so case-insensitive file systems give the same result.
    forbidden = [name for name in ("CONTEXT.md", "CONTEXT-MAP.md") if name in os.listdir(root)]
    scanned = _glossary_scan_files(root)
    forbidden.extend(
        path.relative_to(root).as_posix() for path in scanned
        if path.name == "CONTEXT-FORMAT.md" and path.relative_to(root).parts[:1] in ((".claude",), (".agents",))
    )
    messages.extend(f"{rel} must not exist (renamed to GLOSSARY)" for rel in sorted(forbidden))
    hits, unreadable = [], []
    for path in scanned:
        rel = path.relative_to(root).as_posix()
        try:
            text = path.read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            unreadable.append(rel)
            continue
        for number, line in enumerate(text.splitlines(), start=1):
            hits.extend((rel, number, token) for token in STALE_GLOSSARY_TOKENS if token in line)
    messages.extend(f"{rel}: cannot read as UTF-8" for rel in sorted(unreadable))
    messages.extend(f"{rel}:{number}: stale glossary token {token}" for rel, number, token in sorted(hits))
    return messages


def main():
    names, errors = verify(ROOT)
    for error in errors:
        print(f"FAIL: {error}", file=sys.stderr)
    if errors:
        return 1
    print(f"PASS: shared instructions, {len(names)} skills across Claude/Codex trees, invocation policies, helper assets and native role configs")
    print("Static/offline checks only; confirm discovery in fresh Claude Code and Codex sessions.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
