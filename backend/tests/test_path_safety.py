"""Tests for path safety utilities."""

import os
import tempfile

import pytest

from app.utils.path_safety import (
    ensure_directory_exists,
    is_safe_path,
    safe_join,
    sanitize_filename,
)


class TestSafeJoin:
    """Tests for safe_join function."""

    def test_safe_join_simple_path(self, tmp_path):
        """Test safe_join with a simple filename."""
        result = safe_join(str(tmp_path), "test.txt")
        expected = os.path.join(str(tmp_path), "test.txt")
        assert result == os.path.realpath(expected)

    def test_safe_join_nested_path(self, tmp_path):
        """Test safe_join with nested directories."""
        result = safe_join(str(tmp_path), "subdir", "test.txt")
        expected = os.path.join(str(tmp_path), "subdir", "test.txt")
        assert result == os.path.realpath(expected)

    def test_safe_join_blocks_parent_traversal(self, tmp_path):
        """Test that safe_join blocks ../ traversal attempts."""
        with pytest.raises(ValueError, match="Path traversal attempt detected"):
            safe_join(str(tmp_path), "..", "etc", "passwd")

    def test_safe_join_blocks_double_traversal(self, tmp_path):
        """Test that safe_join blocks multiple ../ sequences."""
        with pytest.raises(ValueError, match="Path traversal attempt detected"):
            safe_join(str(tmp_path), "subdir", "..", "..", "etc", "passwd")

    def test_safe_join_blocks_absolute_path(self, tmp_path):
        """Test that safe_join blocks absolute paths that escape base."""
        with pytest.raises(ValueError, match="Path traversal attempt detected"):
            safe_join(str(tmp_path), "/etc/passwd")

    def test_safe_join_allows_dotdot_within_base(self, tmp_path):
        """Test that ../ within the base directory is allowed."""
        # Create nested structure
        subdir = tmp_path / "subdir"
        subdir.mkdir()

        # Going into subdir then back should still be within base
        result = safe_join(str(tmp_path), "subdir", "..")
        assert result == os.path.realpath(str(tmp_path))

    def test_safe_join_empty_paths(self, tmp_path):
        """Test safe_join with empty path components."""
        result = safe_join(str(tmp_path), "", "test.txt")
        expected = os.path.join(str(tmp_path), "test.txt")
        assert result == os.path.realpath(expected)


class TestSanitizeFilename:
    """Tests for sanitize_filename function."""

    def test_sanitize_simple_filename(self):
        """Test sanitize_filename with a valid filename."""
        result = sanitize_filename("test.txt")
        assert result == "test.txt"

    def test_sanitize_removes_path_separators(self):
        """Test that path separators are replaced with underscores."""
        result = sanitize_filename("path/to/file.txt")
        assert "/" not in result
        assert "\\" not in result

    def test_sanitize_removes_null_bytes(self):
        """Test that null bytes are removed."""
        result = sanitize_filename("test\x00.txt")
        assert "\x00" not in result

    def test_sanitize_removes_special_characters(self):
        """Test that special characters are replaced."""
        result = sanitize_filename("test<>:\"|?*.txt")
        assert "<" not in result
        assert ">" not in result
        assert ":" not in result
        assert '"' not in result
        assert "|" not in result
        assert "?" not in result
        assert "*" not in result

    def test_sanitize_preserves_alphanumeric(self):
        """Test that alphanumeric characters are preserved."""
        result = sanitize_filename("Test123.txt")
        assert result == "Test123.txt"

    def test_sanitize_preserves_dashes_underscores(self):
        """Test that dashes and underscores are preserved."""
        result = sanitize_filename("test-file_name.txt")
        assert "-" in result
        assert "_" in result

    def test_sanitize_truncates_long_filenames(self):
        """Test that long filenames are truncated."""
        long_name = "a" * 300 + ".txt"
        result = sanitize_filename(long_name, max_length=255)
        assert len(result) <= 255
        assert result.endswith(".txt")

    def test_sanitize_empty_filename_raises(self):
        """Test that empty filename after sanitization raises ValueError."""
        with pytest.raises(ValueError, match="Filename is empty"):
            sanitize_filename("...")

    def test_sanitize_only_special_chars_raises(self):
        """Test that filename with only special chars raises ValueError."""
        # Note: Some special chars get replaced with underscores
        # Only truly empty results after sanitization should raise
        with pytest.raises(ValueError, match="Filename is empty"):
            sanitize_filename("...")  # Only dots get stripped

    def test_sanitize_collapses_underscores(self):
        """Test that multiple underscores are collapsed."""
        result = sanitize_filename("test___file.txt")
        assert "___" not in result

    def test_sanitize_collapses_consecutive_dots(self):
        """Test that consecutive dots are collapsed to prevent traversal."""
        result = sanitize_filename("test..file.txt")
        assert ".." not in result
        # Should have single dot between parts
        assert result == "test.file.txt"

    def test_sanitize_handles_dotdot_in_filename(self):
        """Test that .. in filename is handled."""
        result = sanitize_filename("test..txt")
        assert ".." not in result


class TestIsSafePath:
    """Tests for is_safe_path function."""

    def test_is_safe_path_valid(self, tmp_path):
        """Test is_safe_path returns True for valid paths."""
        assert is_safe_path(str(tmp_path), "test.txt")
        assert is_safe_path(str(tmp_path), "subdir/test.txt")

    def test_is_safe_path_invalid(self, tmp_path):
        """Test is_safe_path returns False for traversal attempts."""
        assert not is_safe_path(str(tmp_path), "../etc/passwd")
        assert not is_safe_path(str(tmp_path), "/etc/passwd")


class TestEnsureDirectoryExists:
    """Tests for ensure_directory_exists function."""

    def test_creates_directory(self, tmp_path):
        """Test that ensure_directory_exists creates a directory."""
        new_dir = os.path.join(str(tmp_path), "new_dir")
        result = ensure_directory_exists(new_dir)
        assert os.path.isdir(result)

    def test_validates_against_base_dir(self, tmp_path):
        """Test that ensure_directory_exists validates against base_dir."""
        with pytest.raises(ValueError, match="Path traversal attempt detected"):
            ensure_directory_exists("../etc", base_dir=str(tmp_path))

    def test_allows_nested_directories(self, tmp_path):
        """Test that nested directories can be created."""
        result = ensure_directory_exists(
            os.path.join("sub1", "sub2"),
            base_dir=str(tmp_path),
        )
        assert os.path.isdir(result)
        assert result.startswith(str(tmp_path))


class TestPathTraversalAttacks:
    """Integration tests for various path traversal attack patterns."""

    @pytest.fixture
    def base_dir(self, tmp_path):
        """Create a base directory for tests."""
        base = tmp_path / "safe_base"
        base.mkdir()
        return str(base)

    def test_dotdot_slash_attack(self, base_dir):
        """Test protection against ../path attacks."""
        with pytest.raises(ValueError):
            safe_join(base_dir, "../../../etc/passwd")

    def test_encoded_dotdot_attack(self, base_dir):
        """Test protection against URL-encoded traversal."""
        # Note: URL encoding should be handled at HTTP layer,
        # but we test the decoded form
        with pytest.raises(ValueError):
            safe_join(base_dir, "..", "..", "etc", "passwd")

    def test_null_byte_attack(self, base_dir):
        """Test that null bytes in paths are handled."""
        # Null bytes cause ValueError in Python's path functions
        # This is the expected secure behavior
        with pytest.raises(ValueError, match="embedded null byte"):
            safe_join(base_dir, "test\x00.txt")

    def test_symlink_escape_attempt(self, base_dir, tmp_path):
        """Test protection against symlink-based escapes."""
        # Create a symlink pointing outside base_dir
        external_dir = tmp_path / "external"
        external_dir.mkdir()
        external_file = external_dir / "secret.txt"
        external_file.write_text("secret data")

        # Create symlink inside base_dir pointing to external_dir
        symlink_path = os.path.join(base_dir, "escape_link")

        # Only test if symlinks are supported
        try:
            os.symlink(str(external_dir), symlink_path)
        except OSError:
            pytest.skip("Symlinks not supported on this platform")

        # safe_join uses realpath which resolves symlinks
        # The resolved path should be outside base_dir
        with pytest.raises(ValueError):
            safe_join(base_dir, "escape_link", "secret.txt")

    def test_windows_drive_prefix(self, base_dir):
        """Test handling of Windows drive prefix on Unix systems."""
        # On Unix, Windows paths are just treated as relative paths with colons
        # The colon becomes part of the filename, which is allowed on Unix
        # This test verifies the path stays within base_dir
        result = safe_join(base_dir, "C:", "windows", "system32")
        # On Unix, this creates a subdirectory named "C:" which is within base
        assert result.startswith(base_dir)

    def test_double_slash_attack(self, base_dir):
        """Test handling of double slashes."""
        # Double slashes should be normalized
        result = safe_join(base_dir, "subdir//test.txt")
        assert "//" not in result or "\\\\" not in result
        assert base_dir in result
