import { OutputFormat } from '@media-forge/core';

/**
 * Resolve f_auto by reading the browser's Accept header.
 *
 * Priority: AVIF (smallest) → WebP → original format.
 * The Accept header looks like:
 *   "image/avif,image/webp,image/png,image/*;q=0.8"
 *
 * TODO:
 * - Parse the Accept header into a list of supported types
 * - Check for "image/avif" support → return 'avif'
 * - Check for "image/webp" support → return 'webp'
 * - Fall back to the original format
 * - Handle edge cases: missing header, malformed header, * wildcard
 */
export function negotiateFormat(
  acceptHeader: string | undefined,
  originalFormat: Exclude<OutputFormat, 'auto'>,
): Exclude<OutputFormat, 'auto'> {
  if (!acceptHeader) return originalFormat;

  const accept = acceptHeader.toLowerCase();

  if (accept.includes('image/avif')) return 'avif';
  if (accept.includes('image/webp')) return 'webp';

  return originalFormat;
}

/** Map file extension to OutputFormat */
export function extToFormat(ext: string): Exclude<OutputFormat, 'auto'> {
  const map: Record<string, Exclude<OutputFormat, 'auto'>> = {
    jpg: 'jpg', jpeg: 'jpg', png: 'png', webp: 'webp',
    avif: 'avif', gif: 'gif',
  };
  return map[ext.toLowerCase()] ?? 'jpg';
}

/** Map OutputFormat to MIME type */
export function formatToMime(format: Exclude<OutputFormat, 'auto'>): string {
  const map: Record<string, string> = {
    jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    avif: 'image/avif', gif: 'image/gif',
  };
  return map[format] ?? 'application/octet-stream';
}
