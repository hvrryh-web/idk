"""Path safety utilities for secure file operations."""

import os
import re
from typing import Optional


def safe_join(base_dir: str, *paths: str) -> str:
    """
    Securely join paths, preventing directory traversal attacks.
    
    Args:
        base_dir: The base directory that all paths must remain within
        *paths: Path components to join
        
    Returns:
        The resolved absolute path
        
    Raises:
        ValueError: If the resulting path would be outside base_dir
    """
    # Resolve the base directory to an absolute path
    base = os.path.realpath(base_dir)
    
    # Join and resolve the target path
    target = os.path.realpath(os.path.join(base_dir, *paths))
    
    # Ensure the target is within the base directory
    # The target must either equal base or start with base + separator
    if target != base and not target.startswith(base + os.sep):
        raise ValueError("Path traversal attempt detected")
    
    return target


def sanitize_filename(filename: str, max_length: int = 255) -> str:
    """
    Sanitize a filename by removing dangerous characters.
    
    Args:
        filename: The filename to sanitize
        max_length: Maximum allowed length for the filename
        
    Returns:
        A safe filename string
        
    Raises:
        ValueError: If the filename is empty after sanitization
    """
    # Remove path separators and null bytes
    filename = filename.replace("/", "_").replace("\\", "_").replace("\x00", "")
    
    # Remove or replace other dangerous characters
    # Keep only alphanumeric, dash, underscore, dot, and space
    filename = re.sub(r"[^\w\-. ]", "_", filename)
    
    # Replace consecutive dots with single dot (prevents ".." traversal in filenames)
    filename = re.sub(r"\.{2,}", ".", filename)
    
    # Remove leading/trailing dots and spaces
    filename = filename.strip(". ")
    
    # Collapse multiple underscores/dashes
    filename = re.sub(r"[_]+", "_", filename)
    filename = re.sub(r"[-]+", "-", filename)
    
    # Truncate to max length
    if len(filename) > max_length:
        # Preserve extension if present
        name, ext = os.path.splitext(filename)
        if ext:
            max_name_len = max_length - len(ext)
            filename = name[:max_name_len] + ext
        else:
            filename = filename[:max_length]
    
    if not filename:
        raise ValueError("Filename is empty after sanitization")
    
    return filename


def is_safe_path(base_dir: str, path: str) -> bool:
    """
    Check if a path is safely within a base directory.
    
    Args:
        base_dir: The base directory to check against
        path: The path to validate
        
    Returns:
        True if the path is within base_dir, False otherwise
    """
    try:
        safe_join(base_dir, path)
        return True
    except ValueError:
        return False


def ensure_directory_exists(path: str, base_dir: Optional[str] = None) -> str:
    """
    Ensure a directory exists, creating it if necessary.
    
    Args:
        path: The directory path to ensure exists
        base_dir: Optional base directory for path validation
        
    Returns:
        The resolved absolute path
        
    Raises:
        ValueError: If base_dir is provided and path is outside it
    """
    if base_dir:
        path = safe_join(base_dir, path)
    else:
        path = os.path.realpath(path)
    
    os.makedirs(path, exist_ok=True)
    return path
