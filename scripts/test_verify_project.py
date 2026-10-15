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


if __name__ == "__main__":
    unittest.main()
