#!/usr/bin/env python3
"""Check portable project instructions, per-runtime skill trees, native role configs,
the project glossary convention and license references.

Python 3.11+. Read-only and offline; run from any working directory.
This checks configuration structure, not model-backed workflow behavior.
"""

import hashlib
import json
import os
from pathlib import Path
import re
import stat
import sys
import tomllib
import unicodedata


ROOT = Path(__file__).resolve().parents[1]
REQUIRED = ("research", "security-review", "tw-emoji-commit", "tw-emoji-pr-note", "tw-emoji-release-note", "evidence-report", "agent-browser", "i-have-adhd", "tune-skills")
SANITIZERS = (("tw-emoji-commit", "sanitize_commit.py"), ("tw-emoji-pr-note", "sanitize_pr_note.py"), ("tw-emoji-release-note", "sanitize_release_note.py"))
# chalkdeck: the project glossary is GLOSSARY.md (epic 0001-glossary-rename); these are the old names.
STALE_GLOSSARY_TOKENS = ("CONTEXT.md", "CONTEXT-MAP.md", "CONTEXT-FORMAT.md")


def shared_skill_names(claude_skills):
    """Names of .claude/skills/<name> symlinks to ../../.agents/skills/<name> (open-slide's layout)."""
    return {
        link.name for link in (claude_skills.iterdir() if claude_skills.is_dir() else ())
        if link.is_symlink() and Path(os.readlink(link)) == Path("..", "..", ".agents", "skills", link.name)
    }


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
    shared = shared_skill_names(trees["Claude"])
    for name in sorted(shared):
        check((trees["Codex"] / name / "SKILL.md").is_file(), f"Broken shared skill link: {name}")
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
    errors.extend(check_license_references(root))
    return names, errors


# chalkdeck: glossary convention check (epic 0001-glossary-rename).
def _is_real_dir(path):
    return path.is_dir() and not path.is_symlink()


def _is_real_file(path):
    return path.is_file() and not path.is_symlink()


def _markdown_files(top, skip):
    """Regular, non-symlink *.md files under top; symlinked and skip-named directories are not entered."""
    found = []
    for directory, subdirs, names in os.walk(top):
        subdirs[:] = [d for d in subdirs if d not in skip and not Path(directory, d).is_symlink()]
        found.extend(Path(directory, n) for n in names if n.endswith(".md") and _is_real_file(Path(directory, n)))
    return found


def _glossary_scan_files(root):
    """*.md files in every non-shared skill of both trees (minus node_modules/), AGENTS.md,
    CLAUDE.md, docs/README.md, and docs/agents/ except its top-level skill-tuning/ reports.
    Symlinks are never followed, so the scan stays inside the repository."""
    claude = root / ".claude/skills"
    shared = shared_skill_names(claude)
    files = []
    for tree in (claude, root / ".agents/skills"):
        for skill in tree.iterdir() if _is_real_dir(tree) else ():
            if skill.name not in shared and _is_real_dir(skill):
                files.extend(_markdown_files(skill, {"node_modules"}))
    files.extend(root / name for name in ("AGENTS.md", "CLAUDE.md", "docs/README.md") if _is_real_file(root / name))
    agents_docs = root / "docs/agents"
    for entry in agents_docs.iterdir() if _is_real_dir(root / "docs") and _is_real_dir(agents_docs) else ():
        if _is_real_dir(entry) and entry.name != "skill-tuning":
            files.extend(_markdown_files(entry, set()))
        elif _is_real_file(entry) and entry.name.endswith(".md"):
            files.append(entry)
    return files


def _glossary_is_blank(path):
    try:
        text = path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return True
    return not text.replace("\ufeff", "").strip()


def check_glossary(root):
    """Return one message per glossary-convention violation.

    Messages come in groups, each sorted: the GLOSSARY.md problem, forbidden old files,
    unreadable scanned files, then stale tokens by path, line (counted on newlines) and token.
    """
    messages = []
    glossary = root / "GLOSSARY.md"
    if glossary.is_symlink() or not glossary.is_file() or _glossary_is_blank(glossary):
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
        for number, line in enumerate(text.split("\n"), start=1):
            hits.extend((rel, number, token) for token in STALE_GLOSSARY_TOKENS if token in line)
    messages.extend(f"{rel}: cannot read as UTF-8" for rel in sorted(unreadable))
    messages.extend(f"{rel}:{number}: stale glossary token {token}" for rel, number, token in sorted(hits))
    return messages


# chalkdeck: license-reference check (epic 0005-license-reference-check).
PROVENANCE = "docs/agents/skill-sources.json"
PLACEHOLDER = re.compile(r"<[^<>\s]+>")
SCHEME = re.compile(r"[A-Za-z][A-Za-z0-9+.-]*:")
ROOT_LICENSES = {"LICENSE": "CC-BY-SA-4.0", "LICENSE-CODE": "MIT"}
REQUIRED_LINKS = (("CC BY-SA 4.0", "LICENSE"), ("MIT", "LICENSE-CODE"))
FENCE = re.compile(r"(`{3,}|~{3,})(.*)")
INDENTED_FENCE = re.compile(r" {1,3}(?:`{3,}|~{3,})")
BLOCKQUOTE = re.compile(r" {0,3}>")
LIST_BLOCK = re.compile(r" {0,3}(?:[-*+]|\d{1,9}[.)])(?: {4,}| +(?:`{3,}|~{3,}|>|\[[^\]]+\]:))")
REFERENCE_DEFINITION = re.compile(r" {0,3}\[[^\]]+\]:")
NOTICES = "THIRD_PARTY_NOTICES.md"
LINK = re.compile(
    r"!?\[(?P<text>[^\[\]\n]*)\]\([ \t]*(?P<destination><[^<>\n]*>|[^\s()<>]*)"
    r"(?P<title>[ \t]+(?:\"[^\"\n]*\"|'[^'\n]*'|\([^()\n]*\)))?[ \t]*\)"
)


def _quoted(value):
    """Quoted rendering (spec 0005 Q): JSON text with every non-printable character escaped, so a
    value cannot forge output."""
    text = json.dumps(value, ensure_ascii=False)
    return "".join(char if char.isprintable() else char.encode("unicode_escape").decode("ascii") for char in text)


def _resolve(root, target):
    """The path rules: the reason a target does not name a regular file in the repository, or None."""
    segments = target.split("/")
    if target.startswith(("/", "\\")) or "\\" in target or ".." in segments:
        return "is outside the repository"
    if any(char in "%?<>" or char.isspace() for char in target) or "" in segments or "." in segments:
        return "is not a plain repository path"
    current, walked, mode = root, [], 0
    try:
        for segment in segments:
            names = os.listdir(current)
            if segment not in names:
                folded = unicodedata.normalize("NFC", segment).casefold()
                close = sorted(name for name in names if unicodedata.normalize("NFC", name).casefold() == folded)
                if close:
                    return f"differs in case from {_quoted('/'.join(walked + [close[0]]))}"
                return "does not exist"
            walked.append(segment)
            current = current / segment
            mode = os.lstat(current).st_mode
            if stat.S_ISLNK(mode):
                return f"passes through a symlink at {_quoted('/'.join(walked))}"
    except OSError:
        return "does not exist"
    return None if stat.S_ISREG(mode) else "is not a regular file"


def _location_reason(root, value):
    """Steps 1-7 of license reference (a), spec 0005: a reason, or None when the value is valid or
    skipped."""
    if not isinstance(value, str):
        return "is not a string"
    if value == "":
        return "is empty"
    if PLACEHOLDER.search(value) or any(char.isspace() for char in value.strip()):
        return None
    if value != value.strip():
        return "has leading or trailing whitespace"
    scheme = SCHEME.match(value)
    if scheme:
        drive = len(scheme[0]) == 2  # one letter and a colon, such as C:
        return "is outside the repository" if drive else "uses an unsupported URL scheme"
    return _resolve(root, value)


def _locations(document):
    """(JSON Pointer, value, holder) for every license_location key, in document order, without
    recursion; the holder is the object that holds the key."""
    stack = [(None, document, "", None)]
    while stack:
        key, node, pointer, holder = stack.pop()
        if key == "license_location":
            yield pointer, node, holder
        if isinstance(node, dict):
            children = [(name, value, f"{pointer}/{name.replace('~', '~0').replace('/', '~1')}", node) for name, value in node.items()]
        elif isinstance(node, list):
            children = [(None, value, f"{pointer}/{index}", node) for index, value in enumerate(node)]
        else:
            continue
        stack.extend(reversed(children))


def _unreadable(rel, reason):
    return f"{rel}: cannot read license references ({reason})"


def _parse_int(digits):
    """Reject a JSON integer longer than Python's default 4,300-digit limit, whatever the interpreter allows."""
    if len(digits.lstrip("-")) > 4300:
        raise ValueError("integer too long")
    return int(digits)


def _read_input(root, rel):
    """(text, None) for a readable input file, or (None, reason) for the unreadable-input message."""
    current, mode = root, 0
    for segment in rel.split("/"):
        try:
            names = os.listdir(current)
        except (FileNotFoundError, NotADirectoryError):
            return None, "missing"
        except OSError:
            return None, "not readable"
        if segment not in names:
            return None, "missing"
        current = current / segment
        try:
            mode = os.lstat(current).st_mode
        except OSError:
            return None, "not readable"
        if stat.S_ISLNK(mode):
            return None, "a symlink"
    if not stat.S_ISREG(mode):
        return None, "not a regular file"
    try:
        data = current.read_bytes()
    except OSError:
        return None, "not readable"
    try:
        return data.decode("utf-8"), None
    except UnicodeDecodeError:
        return None, "not UTF-8"


def _provenance_messages(root, inputs):
    """Messages for the provenance file: (a) and (d) in document order, or one unreadable-input message."""
    text, unreadable = _read_input(root, PROVENANCE)
    if unreadable:
        inputs.append(_unreadable(PROVENANCE, unreadable))
        return []
    try:
        sources = json.loads(text, parse_int=_parse_int)
    except (ValueError, RecursionError):
        inputs.append(_unreadable(PROVENANCE, "not valid JSON"))
        return []
    if not isinstance(sources, dict):
        inputs.append(_unreadable(PROVENANCE, "not a JSON object"))
        return []
    messages = []
    for pointer, value, holder in _locations(sources):
        prefix = f"{PROVENANCE}: license reference {_quoted(value)} at {_quoted(pointer)}"
        reason = _location_reason(root, value)
        if reason:
            messages.append(f"{prefix} {reason}")
        required = ROOT_LICENSES.get(value) if isinstance(value, str) else None
        if required and "license" in holder and holder["license"] != required:
            messages.append(f"{prefix} is {required}, not {_quoted(holder['license'])}")
    return messages


def _code_spans(line):
    """(spans, unmatched): code spans as (start, end) pairs, found left to right, and whether a
    backtick run has no closing run of the same length on the line."""
    runs = [(run.start(), run.end()) for run in re.finditer(r"`+", line)]
    spans, unmatched, index = [], False, 0
    while index < len(runs):
        start, end = runs[index]
        closer = next((j for j in range(index + 1, len(runs)) if runs[j][1] - runs[j][0] == end - start), None)
        if closer is None:
            unmatched, index = True, index + 1
        else:
            spans.append((start, runs[closer][1]))
            index = closer + 1
    return spans, unmatched


def _inside(position, spans):
    return any(start <= position < end for start, end in spans)


def _links(line, spans):
    """Recognized links and images on one line, left to right without overlap. A link may hold
    whole code spans in its text, but must not start, end, or have its `](`, destination or title
    inside one."""
    found, index = [], 0
    while index < len(line):
        match = None if _inside(index, spans) else LINK.match(line, index)
        tail = match and match.end("text")
        if match and not any(start < match.end() and tail < end for start, end in spans):
            found.append(match)
            index = match.end()
        else:
            index += 1
    return found


def _construct(number, line, spans, unmatched, links):
    """The first unsupported construct on a line outside fences, in the spec's order, or None."""
    outside = lambda pattern: [hit.start() for hit in re.finditer(pattern, line) if not _inside(hit.start(), spans)]
    exempt = set()
    for match in links:
        if match["destination"].startswith("<"):
            exempt.add(match.start("destination"))
        if match["title"]:
            exempt.update(range(match.start("title"), match.end("title")))
    owned = [(match.start(), match.end()) for match in links]
    cells = spans + [(match.start("text"), match.end("text")) for match in links] + [
        (match.start("destination"), match.end("title") if match["title"] else match.end("destination")) for match in links]
    if number == 1 and line.startswith("\N{ZERO WIDTH NO-BREAK SPACE}"):
        return "byte order mark"
    if "\r" in line:
        return "carriage return"
    if FENCE.match(line) and FENCE.match(line)[1].startswith("`") and "`" in FENCE.match(line)[2]:
        return "backtick in fence info string"
    if INDENTED_FENCE.match(line):
        return "indented fence"
    if unmatched:
        return "unmatched backtick"
    if line.lstrip().startswith("|") and any("|" in line[start:end] for start, end in cells):
        return "pipe inside a table cell element"
    if any(position not in exempt for position in outside("<")):
        return "raw HTML or autolink"
    if BLOCKQUOTE.match(line):
        return "blockquote"
    if LIST_BLOCK.match(line):
        return "block inside a list item"
    if "\t" in re.match(r"[ \t]*", line)[0]:
        return "tab indentation"
    if REFERENCE_DEFINITION.match(line):
        return "link reference definition"
    if line.startswith("    ") and outside(r"\]\("):
        return "indented line with a link"
    if outside(r"\\[\[\]()<>`]"):
        return "backslash escape"
    if any(match["text"].strip() == "" for match in links):
        return "empty link text"
    if any(not any(start <= position < end for start, end in owned) for position in outside(r"\]\(")):
        return "unrecognized link"
    return None


def _destination_reason(root, destination):
    """Steps 1-5 of license reference (b), spec 0005: a reason, or None when valid or skipped."""
    if destination == "":
        return "is empty"
    if destination.startswith("#"):
        return None
    target = destination.split("#", 1)[0]
    scheme = SCHEME.match(target)
    if scheme:
        if scheme[0][:-1].lower() in ("http", "https", "mailto"):
            return None
        return "is outside the repository" if len(scheme[0]) == 2 else "uses an unsupported URL scheme"
    return _resolve(root, target)


def _notices_messages(root, inputs):
    """Messages for the notices: references by line and column, or one unreadable-input message."""
    text, unreadable = _read_input(root, NOTICES)
    if unreadable:
        inputs.append(_unreadable(NOTICES, unreadable))
        return [], []
    constructs, references, linked, fence = {}, [], set(), None
    for number, line in enumerate(text.split("\n"), start=1):
        if fence:
            char, length, _ = fence
            if re.fullmatch(rf" {{0,3}}{re.escape(char)}{{{length},}}[ \t]*", line):
                fence = None
            continue
        opener = FENCE.match(line)
        if opener and not (opener[1].startswith("`") and "`" in opener[2]):
            fence = (opener[1][0], len(opener[1]), number)
            continue
        spans, unmatched = _code_spans(line)
        links = _links(line, spans)
        construct = _construct(number, line, spans, unmatched, links)
        if construct:
            constructs[number] = construct
        for match in links:
            destination = match["destination"]
            if destination.startswith("<"):
                destination = destination[1:-1]
            reason = _destination_reason(root, destination)
            if reason:
                references.append(f"{NOTICES}:{number}: license reference {_quoted(destination)} {reason}")
            if not match[0].startswith("!"):
                linked.add((match["text"], destination.split("#", 1)[0]))
    if fence:
        constructs[fence[2]] = "unclosed code fence"
    unsupported = [f"{NOTICES}:{number}: unsupported Markdown ({name})" for number, name in sorted(constructs.items())]
    missing = [f"{NOTICES}: no inline link [{text}]({target})" for text, target in REQUIRED_LINKS if (text, target) not in linked]
    return unsupported, references + missing


def check_license_references(root):
    """Return one message per bad license reference, in the order the epic 0005 spec defines."""
    inputs = []
    provenance = _provenance_messages(root, inputs)
    unsupported, notices = _notices_messages(root, inputs)
    return inputs + provenance + unsupported + notices


def main():
    names, errors = verify(ROOT)
    for error in errors:
        print(f"FAIL: {error}", file=sys.stderr)
    if errors:
        return 1
    print(f"PASS: shared instructions, {len(names)} skills across Claude/Codex trees, invocation policies, helper assets, native role configs, the glossary convention and license references")
    print("Static/offline checks only; confirm discovery in fresh Claude Code and Codex sessions.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
