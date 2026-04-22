/**
 * Generate a ULID (Universally Unique Lexicographically Sortable Identifier).
 * Used as the primary key for assets, folders, and users.
 *
 * TODO:
 * - Install and use the 'ulid' npm package
 * - Or implement a simple ULID generator:
 *   - 10 chars of Crockford base32 timestamp (ms since epoch)
 *   - 16 chars of Crockford base32 randomness
 *   - Total: 26 chars, sortable by creation time
 *
 * For now, using a simple fallback that produces sortable IDs.
 */
export function generateUlid(): string {
  const timestamp = Date.now().toString(36).padStart(10, '0');
  const random = Math.random().toString(36).substring(2, 12).padStart(10, '0');
  return `${timestamp}${random}`.toUpperCase().substring(0, 26);
}
