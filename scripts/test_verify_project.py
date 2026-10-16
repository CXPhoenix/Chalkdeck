"""Tests for the glossary check in verify-project.py (epic 0001-glossary-rename).

Run with: python3 -m unittest discover -s scripts -p 'test_*.py'
"""

import importlib.util
import os
from pathlib import Path
import tempfile
import unittest

_SPEC = importlib.util.spec_from_file_location("verify_project", Path(__file__).with_name("verify-project.py"))
verify_project = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(verify_project)


CANNOT_DENY_READ = not hasattr(os, "geteuid") or os.geteuid() == 0


def make_symlink(test, target, link):
    """Create a symlink, skipping the test where the platform does not allow it."""
    try:
        os.symlink(target, link)
    except (OSError, NotImplementedError) as error:
        test.skipTest(f"symlinks unavailable: {error}")


class Fixture:
    """A minimal repository in a temporary directory, outside the real checkout."""

    def __init__(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(self._tmp.name)
        self.write("GLOSSARY.md", "# Glossary\n\n**Deck**:\nOne presentation.\n")
        self.write("AGENTS.md", "# Agent instructions\n")
        self.write("CLAUDE.md", "@AGENTS.md\n")
        self.write("docs/README.md", "# Docs\n")
        self.write("docs/agents/domain.md", "# Domain Docs\n")
        self.write(".claude/skills/domain-modeling/SKILL.md", "---\nname: domain-modeling\n---\n")
        self.write(".agents/skills/domain-modeling/SKILL.md", "---\nname: domain-modeling\n---\n")

    def write(self, rel, text):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def check(self):
        return verify_project.check_glossary(self.root)

    def close(self):
        self._tmp.cleanup()


class GlossaryCheckTest(unittest.TestCase):
    def setUp(self):
        self.fx = Fixture()
        self.addCleanup(self.fx.close)

    def test_clean_fixture_reports_nothing(self):
        self.assertEqual(self.fx.check(), [])

    def test_hits_in_subdirectories_are_reported(self):
        self.fx.write(".claude/skills/domain-modeling/references/format.md", "Use CONTEXT.md.\n")
        self.fx.write("docs/agents/notes/extra.md", "Use CONTEXT.md.\n")
        self.assertEqual(self.fx.check(), [
            ".claude/skills/domain-modeling/references/format.md:1: stale glossary token CONTEXT.md",
            "docs/agents/notes/extra.md:1: stale glossary token CONTEXT.md",
        ])

    def test_one_message_per_path_line_token_sorted(self):
        self.fx.write("docs/agents/domain.md", "a CONTEXT.md and CONTEXT-MAP.md\nb CONTEXT.md twice CONTEXT.md\n")
        self.fx.write("AGENTS.md", "see CONTEXT.md\n")
        self.assertEqual(self.fx.check(), [
            "AGENTS.md:1: stale glossary token CONTEXT.md",
            "docs/agents/domain.md:1: stale glossary token CONTEXT-MAP.md",
            "docs/agents/domain.md:1: stale glossary token CONTEXT.md",
            "docs/agents/domain.md:2: stale glossary token CONTEXT.md",
        ])


class StaleTokenRootsTest(unittest.TestCase):
    """Row 9: each stale token in each scanned root type."""

    TOKENS = ("CONTEXT.md", "CONTEXT-MAP.md", "CONTEXT-FORMAT.md")
    ROOTS = (
        ".claude/skills/domain-modeling/SKILL.md",
        ".agents/skills/domain-modeling/SKILL.md",
        "AGENTS.md",
        "CLAUDE.md",
        "docs/README.md",
        "docs/agents/domain.md",
    )

    def test_each_token_in_each_root(self):
        for rel in self.ROOTS:
            for token in self.TOKENS:
                with self.subTest(root=rel, token=token):
                    fx = Fixture()
                    self.addCleanup(fx.close)
                    fx.write(rel, f"line one\nsee {token} here\n")
                    self.assertEqual(fx.check(), [f"{rel}:2: stale glossary token {token}"])


class NotScannedTest(unittest.TestCase):
    """Row 11 and ticket item 6: paths outside the scanned set give no message."""

    PATHS = (
        "docs/adr/0001-example.md",
        "docs/legacy-openspec/specs/x/spec.md",
        "docs/agents/skill-tuning/report.md",
        "docs/agents/skill-sources.json",
        "scripts/notes.md",
        ".proj.specs/0001-x/spec.en.md",
        ".claude/skills/domain-modeling/node_modules/pkg/README.md",
        ".agents/skills/domain-modeling/node_modules/pkg/README.md",
        ".proj.tickets/0001-x/T-0001-x.md",
        ".agents/skills/domain-modeling/agents/openai.yaml",
    )

    def test_each_not_scanned_path(self):
        for rel in self.PATHS:
            with self.subTest(path=rel):
                fx = Fixture()
                self.addCleanup(fx.close)
                fx.write(rel, "mentions CONTEXT.md\n")
                self.assertEqual(fx.check(), [])

    def test_symlinked_markdown_file_is_not_followed(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        outside = tempfile.TemporaryDirectory()
        self.addCleanup(outside.cleanup)
        target = Path(outside.name, "secret.md")
        target.write_text("mentions CONTEXT.md\n", encoding="utf-8")
        make_symlink(self, target, fx.root / "docs/agents/linked.md")
        make_symlink(self, target, fx.root / ".claude/skills/domain-modeling/linked.md")
        self.assertEqual(fx.check(), [])

    def test_symlinked_directory_is_not_walked(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        outside = tempfile.TemporaryDirectory()
        self.addCleanup(outside.cleanup)
        Path(outside.name, "notes.md").write_text("mentions CONTEXT.md\n", encoding="utf-8")
        make_symlink(self, outside.name, fx.root / "docs/agents/elsewhere")
        make_symlink(self, outside.name, fx.root / ".agents/skills/domain-modeling/references")
        self.assertEqual(fx.check(), [])

    def test_symlinked_shared_skill_is_not_scanned(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write(".agents/skills/seaborn/SKILL.md", "---\nname: seaborn\n---\nmentions CONTEXT.md\n")
        make_symlink(self, "../../.agents/skills/seaborn", fx.root / ".claude/skills/seaborn")
        self.assertEqual(fx.check(), [])


class LookAlikeTest(unittest.TestCase):
    """Row 12 and ticket item 6: look-alikes give no message; substrings of a token hit."""

    def test_look_alikes_give_no_message(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write("docs/agents/domain.md", "context\nsingle-context\n# Context Map\nCONTEXT\ncontext.md\nGLOSSARY.md\nGLOSSARY-FORMAT.md\n")
        self.assertEqual(fx.check(), [])

    def test_line_numbers_count_newlines_only(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write("docs/agents/domain.md", "a\x0cb\u2028c\nsee CONTEXT.md\n")
        self.assertEqual(fx.check(), ["docs/agents/domain.md:2: stale glossary token CONTEXT.md"])

    def test_substrings_of_a_token_hit(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write("docs/agents/domain.md", "see CONTEXT.mdx\nlink ./src/x/CONTEXT.md\n")
        self.assertEqual(fx.check(), [
            "docs/agents/domain.md:1: stale glossary token CONTEXT.md",
            "docs/agents/domain.md:2: stale glossary token CONTEXT.md",
        ])


class GlossaryFileTest(unittest.TestCase):
    """Row 13 and ticket item 5: GLOSSARY.md must be a regular, non-blank file."""

    MESSAGE = "GLOSSARY.md is missing, not a regular file, or blank"

    def setUp(self):
        self.fx = Fixture()
        self.addCleanup(self.fx.close)
        (self.fx.root / "GLOSSARY.md").unlink()

    def test_missing(self):
        self.assertEqual(self.fx.check(), [self.MESSAGE])

    def test_symlink(self):
        self.fx.write("docs/real-glossary.md", "# Glossary\n")
        make_symlink(self, "docs/real-glossary.md", self.fx.root / "GLOSSARY.md")
        self.assertEqual(self.fx.check(), [self.MESSAGE])

    def test_whitespace_only(self):
        self.fx.write("GLOSSARY.md", " \n\t\n")
        self.assertEqual(self.fx.check(), [self.MESSAGE])

    def test_unicode_whitespace_only(self):
        self.fx.write("GLOSSARY.md", "\ufeff\u3000\u00a0\n")
        self.assertEqual(self.fx.check(), [self.MESSAGE])

    def test_empty_file(self):
        self.fx.write("GLOSSARY.md", "")
        self.assertEqual(self.fx.check(), [self.MESSAGE])

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_unreadable(self):
        path = self.fx.write("GLOSSARY.md", "# Glossary\n")
        path.chmod(0)
        self.addCleanup(path.chmod, 0o644)
        self.assertEqual(self.fx.check(), [self.MESSAGE])


class ForbiddenPathTest(unittest.TestCase):
    """Row 14 and ticket item 4: old glossary files must not exist; names match exactly."""

    PATHS = (
        "CONTEXT.md",
        "CONTEXT-MAP.md",
        ".claude/skills/domain-modeling/CONTEXT-FORMAT.md",
        ".agents/skills/domain-modeling/CONTEXT-FORMAT.md",
    )

    def test_each_forbidden_path(self):
        for rel in self.PATHS:
            with self.subTest(path=rel):
                fx = Fixture()
                self.addCleanup(fx.close)
                fx.write(rel, "old glossary\n")
                self.assertEqual(fx.check(), [f"{rel} must not exist (renamed to GLOSSARY)"])

    def test_format_file_inside_node_modules_is_not_forbidden(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write(".claude/skills/domain-modeling/node_modules/pkg/CONTEXT-FORMAT.md", "vendored\n")
        self.assertEqual(fx.check(), [])

    def test_lowercase_name_is_not_forbidden(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        fx.write("context.md", "unrelated notes\n")
        self.assertEqual(fx.check(), [])


class UnreadableFileTest(unittest.TestCase):
    """Row 15 and ticket item 3: an unreadable scanned file is reported and scanning continues."""

    def test_non_utf8_file_is_reported_and_scanning_continues(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        (fx.root / "docs/agents/broken.md").write_bytes(b"caf\xe9 CONTEXT.md\n")
        fx.write("AGENTS.md", "see CONTEXT.md\n")
        self.assertEqual(fx.check(), [
            "docs/agents/broken.md: cannot read as UTF-8",
            "AGENTS.md:1: stale glossary token CONTEXT.md",
        ])

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_permission_denied_file_is_reported(self):
        fx = Fixture()
        self.addCleanup(fx.close)
        path = fx.write("docs/agents/locked.md", "CONTEXT.md\n")
        path.chmod(0)
        self.addCleanup(path.chmod, 0o644)
        self.assertEqual(fx.check(), ["docs/agents/locked.md: cannot read as UTF-8"])


if __name__ == "__main__":
    unittest.main()
