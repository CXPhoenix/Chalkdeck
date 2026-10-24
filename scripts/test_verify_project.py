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


# chalkdeck: license-reference check (epic 0005-license-reference-check, T-0007 and T-0008).
PROVENANCE = "docs/agents/skill-sources.json"
NOTICES = "THIRD_PARTY_NOTICES.md"
DEFAULT_NOTICES = "[CC BY-SA 4.0](LICENSE)\n[MIT](LICENSE-CODE)\n"


class LicenseFixture:
    """Matrix defaults: LICENSE, LICENSE-CODE and the two required notices links, in a realpath root."""

    def __init__(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = Path(os.path.realpath(self._tmp.name))
        self.write("LICENSE", "CC BY-SA 4.0\n")
        self.write("LICENSE-CODE", "MIT\n")
        self.write(NOTICES, DEFAULT_NOTICES)
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
    """Rows P1-P9 and approved test plan items #1-#30 and #45-#49: provenance license_location values and the path rules."""

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

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
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
    """Rows D1-D3, D5 and D6 and approved test plan items #31-#44: a root license file and its recorded license agree."""

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


def notices_ref(line, destination, reason):
    """The notices-reference message, with the destination already rendered."""
    return f"{NOTICES}:{line}: license reference {destination} {reason}"


class ProvenanceInputTest(LicenseCase):
    """Rows I1 and I3, provenance side, and approved test plan items #50-#64: an unreadable provenance file."""

    def unreadable(self, reason):
        self.assertEqual(self.fx.check(), [f"{PROVENANCE}: cannot read license references ({reason})"])

    def unreadable_then_notices(self, reason):
        """Row I1: the provenance message, then the notices are still checked (T-0008 #177-#189)."""
        self.fx.write(NOTICES, DEFAULT_NOTICES + "[x](missing)\n")
        self.assertEqual(self.fx.check(), [
            f"{PROVENANCE}: cannot read license references ({reason})",
            notices_ref(3, '"missing"', "does not exist"),
        ])

    def test_i1_missing(self):
        (self.fx.root / PROVENANCE).unlink()
        self.unreadable_then_notices("missing")

    def test_i1_symlink(self):
        target = self.fx.write("docs/agents/real.json", "{}")
        (self.fx.root / PROVENANCE).unlink()
        make_symlink(self, target.name, self.fx.root / PROVENANCE)
        self.unreadable_then_notices("a symlink")

    def test_i1_symlinked_parent(self):
        self.fx.write("elsewhere/skill-sources.json", "{}")
        agents = self.fx.root / "docs/agents"
        (agents / "skill-sources.json").unlink()
        agents.rmdir()
        make_symlink(self, "../elsewhere", agents)
        self.unreadable_then_notices("a symlink")

    def test_i1_directory(self):
        (self.fx.root / PROVENANCE).unlink()
        (self.fx.root / PROVENANCE).mkdir()
        self.unreadable_then_notices("not a regular file")

    @unittest.skipUnless(hasattr(os, "mkfifo"), "mkfifo unavailable")
    def test_i1_fifo(self):
        (self.fx.root / PROVENANCE).unlink()
        os.mkfifo(self.fx.root / PROVENANCE)
        self.unreadable_then_notices("not a regular file")

    def test_i1_docs_is_a_regular_file(self):
        (self.fx.root / PROVENANCE).unlink()
        (self.fx.root / "docs/agents").rmdir()
        (self.fx.root / "docs").rmdir()
        self.fx.write("docs", "not a directory\n")
        self.unreadable_then_notices("missing")

    def test_i1_directory_in_other_case(self):
        (self.fx.root / "docs").rename(self.fx.root / "Docs")
        self.unreadable_then_notices("missing")

    def test_i1_not_utf8(self):
        (self.fx.root / PROVENANCE).write_bytes(b'{"license_location": "\xff"}')
        self.unreadable_then_notices("not UTF-8")

    def test_i1_not_valid_json(self):
        self.fx.write(PROVENANCE, "{")
        self.unreadable_then_notices("not valid JSON")

    def test_i1_utf8_bom(self):
        (self.fx.root / PROVENANCE).write_bytes(b"\xef\xbb\xbf{}")
        self.unreadable_then_notices("not valid JSON")

    def test_i1_deep_nesting(self):
        self.fx.write(PROVENANCE, "[" * 100000 + "]" * 100000)
        self.unreadable_then_notices("not valid JSON")

    def test_i1_long_integer(self):
        self.fx.write(PROVENANCE, '{"license_location": ' + "9" * 5000 + "}")
        self.unreadable_then_notices("not valid JSON")

    def test_i1_top_level_array(self):
        self.fx.write(PROVENANCE, "[]")
        self.unreadable_then_notices("not a JSON object")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_i3_unreadable_file(self):
        path = self.fx.root / PROVENANCE
        path.chmod(0)
        self.addCleanup(path.chmod, 0o644)
        self.unreadable("not readable")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_i3_unsearchable_directory(self):
        agents = self.fx.root / "docs/agents"
        agents.chmod(0o444)
        self.addCleanup(agents.chmod, 0o755)
        self.unreadable("not readable")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_i3_unlistable_directory(self):
        agents = self.fx.root / "docs/agents"
        agents.chmod(0o333)
        self.addCleanup(agents.chmod, 0o755)
        self.unreadable("not readable")


class NoticesCase(LicenseCase):
    """Shared helpers for the notices tests: the default two links, then the row's lines from line 3."""

    def notices(self, *lines):
        self.fx.write(NOTICES, DEFAULT_NOTICES + "".join(line + "\n" for line in lines))

    def expect_notices(self, lines, messages):
        self.notices(*lines)
        self.assertEqual(self.fx.check(), messages)

    def expect_text(self, text, messages):
        self.fx.write(NOTICES, text)
        self.assertEqual(self.fx.check(), messages)

    def none(self, *lines):
        self.expect_notices(lines, [])

    def construct(self, lines, name, line=3, extra=()):
        self.expect_notices(lines, [markdown(line, name), *extra])


class NoticesReferenceTest(NoticesCase):
    """T-0008 approved test plan items #65-#112: notices destinations (b) and the path rules through them."""

    def test_d4_both_kinds_on_one_object(self):
        (self.fx.root / "LICENSE").unlink()
        self.expect({"license": "MIT", "license_location": "LICENSE"}, [
            ref('"LICENSE"', '"/license_location"', "does not exist"),
            ref('"LICENSE"', '"/license_location"', 'is CC-BY-SA-4.0, not "MIT"'),
            notices_ref(1, '"LICENSE"', "does not exist"),
        ])

    def one(self, line_text, destination, reason, line=3):
        self.expect_notices([line_text], [notices_ref(line, destination, reason)])

    def test_n1_plain(self):
        self.none("[x](LICENSE)")

    def test_n1_image(self):
        self.none("![x](LICENSE)")

    def test_n1_angle(self):
        self.none("[x](<LICENSE>)")

    def test_n1_title_double(self):
        self.none('[x](LICENSE "t")')

    def test_n1_title_single(self):
        self.none("[x](LICENSE 't')")

    def test_n1_title_paren(self):
        self.none("[x](LICENSE (t))")

    def test_n1_after_code_span(self):
        self.none("`code` [x](LICENSE)")

    def test_n1_two_space_indent(self):
        self.none("  [x](LICENSE)")

    def test_n1_tab_before_destination(self):
        self.none("[x](\tLICENSE)")

    def test_n1_tab_before_closing_paren(self):
        self.none("[x](LICENSE\t)")

    def test_n2_https(self):
        self.none("[x](https://example.org)")

    def test_n2_http(self):
        self.none("[x](http://example.org)")

    def test_n2_mailto_upper(self):
        self.none("[x](MAILTO:a@example.org)")

    def test_n2_anchor(self):
        self.none("[x](#anchor)")

    def test_n2_fragment(self):
        self.none("[x](LICENSE#section)")

    def test_n2_fragment_before_rule2(self):
        self.none("[x](LICENSE#a%20b)")

    def test_n3_empty(self):
        self.one("[x]()", '""', "is empty")

    def test_n3_empty_angle(self):
        self.one("[x](<>)", '""', "is empty")

    def test_n4_scheme(self):
        self.one("[x](ab:c)", '"ab:c"', "uses an unsupported URL scheme")

    def test_n4_ftp(self):
        self.one("[x](ftp://host/x)", '"ftp://host/x"', "uses an unsupported URL scheme")

    def test_n4_drive(self):
        self.one("[x](C:x)", '"C:x"', "is outside the repository")

    def test_n5_fragment_in_message(self):
        self.fx.write("docs/missing.md", "x\n")
        self.one("[x](docs/Missing.md#top)", '"docs/Missing.md#top"', 'differs in case from "docs/missing.md"')

    def test_n6_line_number(self):
        self.expect_notices(["text", "[x](missing)"], [notices_ref(4, '"missing"', "does not exist")])

    def test_r1_absolute(self):
        self.one("[x](/LICENSE)", '"/LICENSE"', "is outside the repository")

    def test_r1_leading_backslash(self):
        self.one(r"[x](\LICENSE)", r'"\\LICENSE"', "is outside the repository")

    def test_r1_inner_backslash(self):
        self.one(r"[x](a\LICENSE)", r'"a\\LICENSE"', "is outside the repository")

    def test_r1_parent(self):
        self.one("[x](../LICENSE)", '"../LICENSE"', "is outside the repository")

    def test_r1_parent_inside(self):
        (self.fx.root / "a").mkdir()
        self.one("[x](a/../LICENSE)", '"a/../LICENSE"', "is outside the repository")

    def test_r1_network(self):
        self.one("[x](//host/x)", '"//host/x"', "is outside the repository")

    def test_r1_before_rule2(self):
        self.one("[x](../a%20b)", '"../a%20b"', "is outside the repository")

    def test_r2_percent(self):
        self.fx.write("a%20b.md", "x\n")
        self.one("[x](a%20b.md)", '"a%20b.md"', "is not a plain repository path")

    def test_r2_query(self):
        self.one("[x](LICENSE?plain=1)", '"LICENSE?plain=1"', "is not a plain repository path")

    def test_r2_dot_segment(self):
        self.one("[x](./LICENSE)", '"./LICENSE"', "is not a plain repository path")

    def test_r2_empty_segment(self):
        self.one("[x](a//b)", '"a//b"', "is not a plain repository path")

    def test_r2_trailing_slash(self):
        self.one("[x](docs/)", '"docs/"', "is not a plain repository path")

    def test_r2_whitespace(self):
        self.fx.write("docs/my file.md", "x\n")
        self.one("[x](<docs/my file.md>)", '"docs/my file.md"', "is not a plain repository path")

    def test_r3_missing(self):
        self.one("[x](missing)", '"missing"', "does not exist")

    def test_r3_below_a_file(self):
        self.one("[x](LICENSE/x)", '"LICENSE/x"', "does not exist")

    def test_r3_three_dots(self):
        self.one("[x](.../LICENSE)", '".../LICENSE"', "does not exist")

    def test_r4_case(self):
        self.one("[x](license)", '"license"', 'differs in case from "LICENSE"')

    def test_r4_directory_case(self):
        self.fx.write("docs/x.md", "x\n")
        self.one("[x](Docs/x.md)", '"Docs/x.md"', 'differs in case from "docs"')

    def test_r4_normalization(self):
        nfd, nfc = "e\u0301.md", "\u00e9.md"
        self.fx.write(nfd, "x\n")
        if nfd not in os.listdir(self.fx.root):
            self.skipTest("the file system does not keep NFD names")
        self.one(f"[x]({nfc})", f'"{nfc}"', f'differs in case from "{nfd}"')

    def test_r5_final_symlink(self):
        make_symlink(self, "LICENSE", self.fx.root / "link")
        self.one("[x](link)", '"link"', 'passes through a symlink at "link"')

    def test_r5_parent_symlink(self):
        self.fx.write("real/LICENSE", "x\n")
        make_symlink(self, "real", self.fx.root / "sub")
        self.one("[x](sub/LICENSE)", '"sub/LICENSE"', 'passes through a symlink at "sub"')

    def test_r5_symlink_case(self):
        make_symlink(self, "LICENSE", self.fx.root / "link")
        self.one("[x](LINK)", '"LINK"', 'differs in case from "link"')

    def test_r6_directory(self):
        (self.fx.root / "adir").mkdir()
        self.one("[x](adir)", '"adir"', "is not a regular file")

    @unittest.skipUnless(hasattr(os, "mkfifo"), "mkfifo unavailable")
    def test_r6_fifo(self):
        os.mkfifo(self.fx.root / "fifo")
        self.one("[x](fifo)", '"fifo"', "is not a regular file")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_r7_unlistable(self):
        sub = self.fx.write("sub/LICENSE", "x\n").parent
        sub.chmod(0)
        self.addCleanup(sub.chmod, 0o755)
        self.one("[x](sub/LICENSE)", '"sub/LICENSE"', "does not exist")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_r7_unsearchable(self):
        sub = self.fx.write("sub/LICENSE", "x\n").parent
        sub.chmod(0o444)
        self.addCleanup(sub.chmod, 0o755)
        self.one("[x](sub/LICENSE)", '"sub/LICENSE"', "does not exist")


MISSING_LINK = {
    "LICENSE": f"{NOTICES}: no inline link [CC BY-SA 4.0](LICENSE)",
    "LICENSE-CODE": f"{NOTICES}: no inline link [MIT](LICENSE-CODE)",
}


class RequiredLinkTest(NoticesCase):
    """T-0008 approved test plan items #164-#176: the two required links (c)."""

    def test_c1_no_license_link(self):
        self.expect_text("[MIT](LICENSE-CODE)\n", [MISSING_LINK["LICENSE"]])

    def test_c1_no_license_code_link(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n", [MISSING_LINK["LICENSE-CODE"]])

    def test_c2_only_in_skipped_regions(self):
        self.expect_text("`[CC BY-SA 4.0](LICENSE)`\n```\n[MIT](LICENSE-CODE)\n```\n",
                         [MISSING_LINK["LICENSE"], MISSING_LINK["LICENSE-CODE"]])

    def test_c3_fragment(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE#section)\n[MIT](LICENSE-CODE)\n", [])

    def test_c3_angle(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n[MIT](<LICENSE-CODE>)\n", [])

    def test_c3_title(self):
        self.expect_text('[CC BY-SA 4.0](LICENSE)\n[MIT](LICENSE-CODE "t")\n', [])

    def test_c4_wrong_text(self):
        self.expect_text("[CC-BY-SA](LICENSE)\n[MIT](LICENSE-CODE)\n", [MISSING_LINK["LICENSE"]])

    def test_c4_swapped(self):
        self.expect_text("[MIT](LICENSE)\n[CC BY-SA 4.0](LICENSE-CODE)\n",
                         [MISSING_LINK["LICENSE"], MISSING_LINK["LICENSE-CODE"]])

    def test_c4_image(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n![MIT](LICENSE-CODE)\n", [MISSING_LINK["LICENSE-CODE"]])

    def test_c4_dot_path(self):
        self.expect_text("[CC BY-SA 4.0](./LICENSE)\n[MIT](LICENSE-CODE)\n",
                         [notices_ref(1, '"./LICENSE"', "is not a plain repository path"), MISSING_LINK["LICENSE"]])

    def test_c4_case(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n[MIT](license-code)\n",
                         [notices_ref(2, '"license-code"', 'differs in case from "LICENSE-CODE"'), MISSING_LINK["LICENSE-CODE"]])

    def test_c4_padded_text(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n[ MIT ](LICENSE-CODE)\n", [MISSING_LINK["LICENSE-CODE"]])

    def test_c4_lowercase_text(self):
        self.expect_text("[CC BY-SA 4.0](LICENSE)\n[mit](LICENSE-CODE)\n", [MISSING_LINK["LICENSE-CODE"]])


def markdown(line, construct):
    """The unsupported-construct message."""
    return f"{NOTICES}:{line}: unsupported Markdown ({construct})"


class NoticesGrammarTest(NoticesCase):
    """T-0008 approved test plan items #113-#163: fences, code spans and the fifteen constructs."""

    def test_g1_code_span(self):
        self.none("`[x](missing)`")

    def test_g1_backtick_fence(self):
        self.none("```", "[x](missing)", "```")

    def test_g1_tilde_fence(self):
        self.none("~~~", "[x](missing)", "~~~")

    def test_g1_longer_closer(self):
        self.none("```", "[x](missing)", "````")

    def test_g1_indented_closer(self):
        self.none("```", "[x](missing)", "   ```")

    def test_g1_info_string(self):
        self.none("```python", "[x](missing)", "```")

    def test_g2_four_space_backticks(self):
        self.construct(["    ```"], "unmatched backtick")

    def test_g2_closed_by_other_character(self):
        self.construct(["```", "~~~", "[x](missing)"], "unclosed code fence")

    def test_g2_shorter_closer(self):
        self.construct(["````", "```", "[x](missing)"], "unclosed code fence")

    def test_g2_closer_with_text(self):
        self.construct(["```", "``` x", "[x](missing)"], "unclosed code fence")

    def test_g2_indented_opener(self):
        self.construct(["  ~~~", "[x](missing)"], "indented fence", extra=[notices_ref(4, '"missing"', "does not exist")])

    def test_g3_byte_order_mark(self):
        self.fx.write(NOTICES, chr(0xFEFF) + DEFAULT_NOTICES)
        self.assertEqual(self.fx.check(), [markdown(1, "byte order mark")])

    def test_g3_carriage_return(self):
        self.construct(["text\r"], "carriage return")

    def test_g3_backtick_in_info_string(self):
        self.construct(["```x```"], "backtick in fence info string")

    def test_g3_unmatched_backtick(self):
        self.construct(["a ` b"], "unmatched backtick")

    def test_g3_html_comment(self):
        self.construct(["<!-- -->"], "raw HTML or autolink")

    def test_g3_html_block(self):
        self.construct(["<div>"], "raw HTML or autolink")

    def test_g3_autolink(self):
        self.construct(["<https://example.org>"], "raw HTML or autolink")

    def test_g3_blockquote(self):
        self.construct(["> quote"], "blockquote")

    def test_g3_tab_indented(self):
        self.construct(["\ttext"], "tab indentation")

    def test_g3_spaces_then_tab(self):
        self.construct(["  \t[x](LICENSE)"], "tab indentation")

    def test_g3_reference_definition(self):
        self.construct(["[x]: LICENSE"], "link reference definition")

    def test_g3_indented_reference_definition(self):
        self.construct(["   [x]: LICENSE"], "link reference definition")

    def test_g3_indented_line_with_link(self):
        self.construct(["    [x](LICENSE)"], "indented line with a link")

    def test_g3_escaped_bracket(self):
        self.construct([r"a\[b"], "backslash escape")

    def test_g3_escaped_paren(self):
        self.construct([r"a\(b"], "backslash escape")

    def test_g3_empty_link_text(self):
        self.construct(["[](LICENSE)"], "empty link text")

    def test_g3_blank_link_text(self):
        self.construct(["[ ](LICENSE)"], "empty link text")

    def test_g3_nested_image(self):
        self.fx.write("a.png", "x\n")
        self.construct(["[![a](a.png)](LICENSE)"], "unrecognized link")

    def test_g3_space_in_destination(self):
        self.construct(["[a](b c)"], "unrecognized link")

    def test_g3_link_text_over_two_lines(self):
        self.construct(["[a", "b](LICENSE)"], "unrecognized link", line=4)

    def test_g4_comment_beats_backslash(self):
        self.construct([r"<!-- a\[b -->"], "raw HTML or autolink")

    def test_g4_carriage_return_beats_html(self):
        self.construct(["a<b\r"], "carriage return")

    def test_g5_comment_in_fence(self):
        self.none("```", "<!--", "```")

    def test_g5_four_spaces_without_link(self):
        self.none("    text")

    def test_g5_comment_in_code_span(self):
        self.none("`<!--`")

    def test_g5_other_backslash(self):
        self.none(r"a\x")

    def test_g5_angle_destination(self):
        self.none("[x](<LICENSE>)")

    def test_g6_link_on_construct_line(self):
        self.construct(["<b>[x](missing)</b>"], "raw HTML or autolink", extra=[notices_ref(3, '"missing"', "does not exist")])

    def test_g6_required_link_in_comment(self):
        self.fx.write(NOTICES, "[CC BY-SA 4.0](LICENSE)\n<!-- [MIT](LICENSE-CODE) -->\n")
        self.assertEqual(self.fx.check(), [markdown(2, "raw HTML or autolink")])

    def test_g7_link_text_in_title(self):
        self.fx.write(NOTICES, '[CC BY-SA 4.0](LICENSE)\n[x](LICENSE "[MIT](LICENSE-CODE)")\n')
        self.assertEqual(self.fx.check(), [MISSING_LINK["LICENSE-CODE"]])

    def test_g8_pipe_in_title(self):
        self.construct(['| a | [MIT](LICENSE-CODE "MIT | code") |'], "pipe inside a table cell element")

    def test_g8_pipe_in_code_span(self):
        self.construct(["| `x | y` |"], "pipe inside a table cell element")

    def test_g8_plain_table_row(self):
        self.none("| a | `b` | [x](LICENSE) |")

    def test_g9_fence_in_list_item(self):
        self.construct(["- ~~~"], "block inside a list item")

    def test_g9_indented_code_in_list_item(self):
        self.construct(["-     [MIT](LICENSE-CODE)"], "block inside a list item")

    def test_g9_reference_definition_in_list_item(self):
        self.construct(["- [lc]: LICENSE"], "block inside a list item")

    def test_g9_blockquote_in_list_item(self):
        self.construct(["1. > quote"], "block inside a list item")

    def test_g9_plain_list_item(self):
        self.none("- [x](LICENSE)")

    def test_g10_code_span_in_link_text(self):
        self.none("[`x`](LICENSE)")

    def test_g10_code_span_in_destination(self):
        self.construct(["[x](a`b`)"], "unrecognized link")

    def test_g5_angle_bracket_in_title(self):
        self.none('[x](LICENSE "a<b")')

    def test_g8_pipe_in_link_text(self):
        self.construct(["| [a|b](LICENSE) |"], "pipe inside a table cell element")

    def test_g8_pipe_in_destination(self):
        self.fx.write("a|b", "x\n")
        self.construct(["| [x](a|b) |"], "pipe inside a table cell element")

    def test_g8_spaces_before_table_row(self):
        self.construct(["  | `a|b` |"], "pipe inside a table cell element")

    def test_g3_escaped_closing_bracket(self):
        self.construct([r"a\]b"], "backslash escape")

    def test_g3_escaped_closing_paren(self):
        self.construct([r"a\)b"], "backslash escape")

    def test_g3_escaped_greater_than(self):
        self.construct([r"a\>b"], "backslash escape")

    def test_g3_escaped_backtick(self):
        self.construct([r"a\`b\`c"], "backslash escape")

    def test_g9_star_marker(self):
        self.construct(["* ~~~"], "block inside a list item")

    def test_g9_plus_marker(self):
        self.construct(["+ > q"], "block inside a list item")

    def test_g9_paren_marker(self):
        self.construct(["1) [lc]: LICENSE"], "block inside a list item")

    def test_g5_byte_order_mark_after_line_1(self):
        self.none(chr(0xFEFF) + "text")

    def test_n1_tab_before_title(self):
        self.none('[x](LICENSE\t"t")')

    def test_g3_unicode_space_then_tab(self):
        self.construct([chr(0x3000) + "\ttext"], "tab indentation")

    def test_g3_tab_before_table_row(self):
        self.construct(["\t| `a|b` |"], "tab indentation")

    def test_g9_non_ascii_digit_marker(self):
        self.none("١. > quote")


class NoticesInputOrderTest(NoticesCase):
    """T-0008 approved test plan items #190-#202: unreadable notices, message order, rendering and wiring."""

    def unreadable_notices(self, reason):
        """Row I2 under Ruling I2-order: the unreadable-input group comes before provenance references."""
        self.fx.provenance({"license_location": "missing"})
        self.assertEqual(self.fx.check(), [
            f"{NOTICES}: cannot read license references ({reason})",
            ref('"missing"', '"/license_location"', "does not exist"),
        ])

    def test_i2_missing(self):
        (self.fx.root / NOTICES).unlink()
        self.unreadable_notices("missing")

    def test_i2_symlink(self):
        target = self.fx.write("real-notices.md", DEFAULT_NOTICES)
        (self.fx.root / NOTICES).unlink()
        make_symlink(self, target.name, self.fx.root / NOTICES)
        self.unreadable_notices("a symlink")

    def test_i2_directory(self):
        (self.fx.root / NOTICES).unlink()
        (self.fx.root / NOTICES).mkdir()
        self.unreadable_notices("not a regular file")

    def test_i2_not_utf8(self):
        (self.fx.root / NOTICES).write_bytes(b"[x](\xff)\n")
        self.unreadable_notices("not UTF-8")

    def test_i2_other_case(self):
        (self.fx.root / NOTICES).rename(self.fx.root / "third_party_notices.md")
        self.unreadable_notices("missing")

    @unittest.skipIf(CANNOT_DENY_READ, "read permission cannot be removed here")
    def test_i3_unreadable_notices(self):
        path = self.fx.root / NOTICES
        path.chmod(0)
        self.addCleanup(path.chmod, 0o644)
        self.assertEqual(self.fx.check(), [f"{NOTICES}: cannot read license references (not readable)"])

    def test_i4_both_missing(self):
        (self.fx.root / NOTICES).unlink()
        (self.fx.root / PROVENANCE).unlink()
        self.assertEqual(self.fx.check(), [
            f"{PROVENANCE}: cannot read license references (missing)",
            f"{NOTICES}: cannot read license references (missing)",
        ])

    def test_o1_group_order(self):
        self.fx.provenance({"license_location": "missing"})
        self.fx.write(NOTICES, "[CC BY-SA 4.0](LICENSE)\n[x](missing)\n<b>\n")
        self.assertEqual(self.fx.check(), [
            ref('"missing"', '"/license_location"', "does not exist"),
            markdown(3, "raw HTML or autolink"),
            notices_ref(2, '"missing"', "does not exist"),
            MISSING_LINK["LICENSE-CODE"],
        ])

    def test_o2_column_order(self):
        self.expect_notices(["[a](zz) [b](aa)"], [notices_ref(3, '"zz"', "does not exist"), notices_ref(3, '"aa"', "does not exist")])

    def test_o3_control_characters(self):
        backslash = chr(92)
        value = ['"' + backslash + "\n" + chr(7) + chr(0x2028)]
        rendered = '["' + backslash + '"' + backslash + backslash + backslash + "n" + backslash + "u0007" + backslash + 'u2028"]'
        self.expect({"license_location": value}, [ref(rendered, '"/license_location"', "is not a string")])

    def test_o3_printable_non_ascii(self):
        self.expect({"license_location": ["授權"]}, [ref('["授權"]', '"/license_location"', "is not a string")])

    def test_o4_pointer_escapes(self):
        self.expect({"a/b": {"c~d": {'e"f': {"": {"license_location": "missing"}}}}},
                    [ref('"missing"', '"/a~1b/c~0d/e' + chr(92) + '"f//license_location"', "does not exist")])

    def test_w1_wiring(self):
        self.notices("[x](missing)")
        _, errors = verify_project.verify(self.fx.root)
        license_messages = self.fx.check()
        self.assertIn(notices_ref(3, '"missing"', "does not exist"), license_messages)
        self.assertEqual(errors[-len(license_messages):], license_messages)
        self.assertEqual(errors[-len(license_messages) - 1], "GLOSSARY.md is missing, not a regular file, or blank")


if __name__ == "__main__":
    unittest.main()
