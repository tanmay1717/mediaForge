import { TransformParams } from '../types/transform';
import { sha256 } from '../utils/hash';

/**
 * Generate a deterministic cache key for a transform + asset path combination.
 * Same inputs always produce the same hash → used for S3 transform cache lookup.
 *
 * TODO:
 * - Serialize TransformParams to a canonical string (sorted keys, stable order)
 * - Concatenate with the asset path
 * - SHA-256 hash the result
 * - Return first 16 hex characters (enough for uniqueness, short for S3 keys)
 */
export function generateCacheKey(params: TransformParams, assetPath: string): string {
  // Canonical serialization: sort keys alphabetically, join as key=value pairs
  const canonical = Object.entries(params)
    .filter(([_, v]) => v !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join('&');

  const input = `${canonical}|${assetPath}`;
  return sha256(input).substring(0, 16);
}
