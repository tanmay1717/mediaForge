/**
 * Sanitize and validate an asset/folder path to prevent path traversal attacks.
 *
 * TODO:
 * - Remove any ".." segments
 * - Remove any double slashes "//"
 * - Remove leading/trailing slashes
 * - Remove null bytes (\0)
 * - Reject paths containing backslashes
 * - Reject paths longer than 1024 characters
 * - Normalize unicode (NFC)
 * - Return the sanitized path
 */
export function sanitizePath(rawPath: string): string {
  let path = rawPath;

  // Remove null bytes
  path = path.replace(/\0/g, '');

  // Remove path traversal
  path = path.replace(/\.\.\//g, '').replace(/\.\./g, '');

  // Remove double slashes
  path = path.replace(/\/+/g, '/');

  // Remove leading/trailing slashes
  path = path.replace(/^\/|\/$/g, '');

  // TODO: Add remaining sanitizations listed above

  return path;
}

/** Check if a path is safe after sanitization */
export function isPathSafe(rawPath: string): boolean {
  const sanitized = sanitizePath(rawPath);
  return sanitized === rawPath && !rawPath.includes('\\') && rawPath.length <= 1024;
}
