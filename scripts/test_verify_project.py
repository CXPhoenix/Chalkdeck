"""Tests for the glossary check and the license-reference check in verify-project.py
(epics 0001-glossary-rename and 0005-license-reference-check).

Run with: python3 -m unittest discover -s scripts -p 'test_*.py'
"""

import importlib.util
import json
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



# chalkdeck: license-reference check, provenance side (epic 0005-license-reference-check, T-0007).
PROVENANCE = "docs/agents/skill-sources.json"
DEFAULT_NOTICES = "[CC BY-SA 4.0](LICENSE)\n[MIT](LICENSE-CODE)\n"


class LicenseFixture:
    """Matrix defaults: LICENSE, LICENSE-CODE and the two required notices links, in a realpath root."""

    def __init__(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(os.path.realpath(self._tmp.name))
        self.write("LICENSE", "CC BY-SA 4.0\n")
        self.write("LICENSE-CODE", "MIT\n")
        self.write("THIRD_PARTY_NOTICES.md", DEFAULT_NOTICES)
        self.write(PROVENANCE, "{}")

    def write(self, rel, text):
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def provenance(self, value):
        self.write(PROVENANCE, json.dumps(value, ensure_ascii=False))

    def check(self):
        return verify_project.check_license_references(self.root)

    def close(self):
        self._tmp.cleanup()


def ref(value, pointer, reason):
    """The provenance-reference message, with value and pointer already rendered."""
    return f"{PROVENANCE}: license reference {value} at {pointer} {reason}"


class LicenseCase(unittest.TestCase):
    """Shared fixture and assertions for the license-reference tests; it holds no tests itself."""

    def setUp(self):
        self.fx = LicenseFixture()
        self.addCleanup(self.fx.close)

    def expect(self, value, messages):
        self.fx.provenance(value)
        self.assertEqual(self.fx.check(), messages)

    def loc(self, value, rendered, reason):
        """Expect exactly one message for a one-key object {"license_location": value}."""
        self.expect({"license_location": value}, [ref(rendered, '"/license_location"', reason)])


class ProvenanceReferenceTest(LicenseCase):
    """Rows P1-P9 and approved test plan items #1-#30 and #45-#49: provenance values, (a) and the path rules."""

    def test_p7_missing_file(self):
        self.expect({"license_location": "missing.md"}, [ref('"missing.md"', '"/license_location"', "does not exist")])

    def test_p1_valid_top_level(self):
        self.expect({"license_location": "LICENSE"}, [])

    def test_p8_pointer_through_array(self):
        self.expect({"x": [{"license_location": "missing"}]}, [ref('"missing"', '"/x/0/license_location"', "does not exist")])

    def test_p9_document_order(self):
        value = {"b": {"license_location": "missing-b"}, "a": [{"license_location": "missing-1"}, {"license_location": "missing-0"}]}
        self.expect(value, [
            ref('"missing-b"', '"/b/license_location"', "does not exist"),
            ref('"missing-1"', '"/a/0/license_location"', "does not exist"),
            ref('"missing-0"', '"/a/1/license_location"', "does not exist"),
        ])

    def test_p1_valid_nested(self):
        self.expect({"a": {"b": {"c": {"license_location": "LICENSE-CODE"}}}}, [])

    def test_p1_valid_in_array(self):
        self.expect({"x": [{"license_location": "LICENSE"}]}, [])

    def test_p4_empty(self):
        self.loc("", '""', "is empty")

    def test_p3_number(self):
        self.loc(5, "5", "is not a string")

    def test_p3_null(self):
        self.loc(None, "null", "is not a string")

    def test_p3_true(self):
        self.loc(True, "true", "is not a string")

    def test_p3_array(self):
        self.loc(["x"], '["x"]', "is not a string")

    def test_p3_object_with_nested_location(self):
        self.expect({"license_location": {"license_location": "missing"}}, [
            ref('{"license_location": "missing"}', '"/license_location"', "is not a string"),
            ref('"missing"', '"/license_location/license_location"', "does not exist"),
        ])

    def test_p2_placeholder(self):
        self.expect({"license_location": ".agents/skills/<skill>/LICENSE"}, [])

    def test_p2_sentence(self):
        self.expect({"license_location": "Upstream repository root LICENSE; the skill directories ship no LICENSE file."}, [])

    def test_p5_trailing_space(self):
        self.loc("LICENSE-CODE ", '"LICENSE-CODE "', "has leading or trailing whitespace")

    def test_p2_leading_space_with_placeholder(self):
        self.expect({"license_location": " <x>"}, [])

    def test_p2_leading_space_with_inner_space(self):
        self.expect({"license_location": " a b"}, [])

    def test_p5_leading_space(self):
        self.loc(" LICENSE-CODE", '" LICENSE-CODE"', "has leading or trailing whitespace")

    def test_p5_trailing_newline(self):
        self.loc("LICENSE-CODE\n", '"LICENSE-CODE\\n"', "has leading or trailing whitespace")

    def test_p5_whitespace_only(self):
        self.loc("  ", '"  "', "has leading or trailing whitespace")

    def test_p5_trailing_ideographic_space(self):
        self.loc("LICENSE-CODE\u3000", '"LICENSE-CODE\\u3000"', "has leading or trailing whitespace")

    def test_p6_url_scheme(self):
        self.loc("https://example.org/LICENSE", '"https://example.org/LICENSE"', "uses an unsupported URL scheme")

    def test_p6_drive(self):
        self.loc("C:LICENSE", '"C:LICENSE"', "is outside the repository")

    def test_p7_fragment_is_not_stripped(self):
        self.loc("LICENSE#x", '"LICENSE#x"', "does not exist")

    def test_p7_absolute(self):
        self.loc("/LICENSE", '"/LICENSE"', "is outside the repository")

    def test_p7_dot_segment(self):
        self.loc("./LICENSE", '"./LICENSE"', "is not a plain repository path")

    def test_p7_unpaired_angle_bracket(self):
        self.loc("LICENSE<old", '"LICENSE<old"', "is not a plain repository path")

    def test_p7_case_mismatch(self):
        self.loc("license", '"license"', 'differs in case from "LICENSE"')

    def test_p7_symlink(self):
        make_symlink(self, "LICENSE", self.fx.root / "link")
        self.loc("link", '"link"', 'passes through a symlink at "link"')

    def test_p7_directory(self):
        (self.fx.root / "adir").mkdir()
        self.loc("adir", '"adir"', "is not a regular file")

    def test_p7_segment_below_a_regular_file(self):
        self.loc("LICENSE/x", '"LICENSE/x"', "does not exist")

    @unittest.skipIf(CANNOT_DENY_READ, "running as root or without POSIX permissions")
    def test_p7_unlistable_parent(self):
        sub = self.fx.root / "sub"
        self.fx.write("sub/LICENSE", "MIT\n")
        sub.chmod(0)
        self.addCleanup(sub.chmod, 0o755)
        self.loc("sub/LICENSE", '"sub/LICENSE"', "does not exist")

    def test_p7_closing_angle_bracket(self):
        self.loc("LICENSE>old", '"LICENSE>old"', "is not a plain repository path")

    def test_p7_query(self):
        self.loc("LICENSE?x", '"LICENSE?x"', "is not a plain repository path")

    def test_p7_percent(self):
        self.fx.write("a%20b.md", "text\n")
        self.loc("a%20b.md", '"a%20b.md"', "is not a plain repository path")


class LicenseAgreementTest(LicenseCase):
    """Rows D1-D3, D5 and D6 and approved test plan items #31-#44: (d) license agreement."""

    def mismatch(self, location, required, actual, pointer='"/license_location"'):
        return ref(location, pointer, f"is {required}, not {actual}")

    def test_d1_license_with_mit(self):
        self.expect({"license": "MIT", "license_location": "LICENSE"}, [self.mismatch('"LICENSE"', "CC-BY-SA-4.0", '"MIT"')])

    def test_d1_license_code_with_cc(self):
        self.expect({"license": "CC-BY-SA-4.0", "license_location": "LICENSE-CODE"}, [self.mismatch('"LICENSE-CODE"', "MIT", '"CC-BY-SA-4.0"')])

    def test_d1_license_code_with_null(self):
        self.expect({"license": None, "license_location": "LICENSE-CODE"}, [self.mismatch('"LICENSE-CODE"', "MIT", "null")])

    def test_d1_license_code_with_lowercase(self):
        self.expect({"license": "mit", "license_location": "LICENSE-CODE"}, [self.mismatch('"LICENSE-CODE"', "MIT", '"mit"')])

    def test_d1_license_code_with_trailing_space(self):
        self.expect({"license": "MIT ", "license_location": "LICENSE-CODE"}, [self.mismatch('"LICENSE-CODE"', "MIT", '"MIT "')])

    def test_d2_license_code_with_mit(self):
        self.expect({"license": "MIT", "license_location": "LICENSE-CODE"}, [])

    def test_d2_license_with_cc(self):
        self.expect({"license": "CC-BY-SA-4.0", "license_location": "LICENSE"}, [])

    def test_d3_skill_license_path(self):
        self.fx.write("skills/x/LICENSE", "Apache License 2.0\n")
        self.expect({"license": "Apache-2.0", "license_location": "skills/x/LICENSE"}, [])

    def test_d3_no_license_key(self):
        self.expect({"license_location": "LICENSE-CODE"}, [])

    def test_d3_location_with_leading_space(self):
        self.expect({"license": "CC-BY-SA-4.0", "license_location": " LICENSE-CODE"},
                    [ref('" LICENSE-CODE"', '"/license_location"', "has leading or trailing whitespace")])

    def test_d3_location_in_other_case(self):
        self.expect({"license": "CC-BY-SA-4.0", "license_location": "license-code"},
                    [ref('"license-code"', '"/license_location"', 'differs in case from "LICENSE-CODE"')])

    def test_d5_position_before_nested(self):
        value = {"license_location": "LICENSE-CODE", "x": {"license_location": "missing"}, "license": "CC-BY-SA-4.0"}
        self.expect(value, [
            self.mismatch('"LICENSE-CODE"', "MIT", '"CC-BY-SA-4.0"'),
            ref('"missing"', '"/x/license_location"', "does not exist"),
        ])

    def test_d6_nested_object(self):
        value = {"skills": {"x": {"licensing": {"license": "CC-BY-SA-4.0", "license_location": "LICENSE-CODE"}}}}
        self.expect(value, [self.mismatch('"LICENSE-CODE"', "MIT", '"CC-BY-SA-4.0"', '"/skills/x/licensing/license_location"')])

    def test_d6_object_in_array(self):
        value = {"list": [{"license": "CC-BY-SA-4.0", "license_location": "LICENSE-CODE"}]}
        self.expect(value, [self.mismatch('"LICENSE-CODE"', "MIT", '"CC-BY-SA-4.0"', '"/list/0/license_location"')])


if __name__ == "__main__":
    unittest.main()
