import { createHash } from 'crypto';

/** SHA-256 hash a string and return hex digest */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/**
 * Hash an API key for storage. Raw key is never persisted.
 *
 * TODO:
 * - Consider adding a pepper/salt for extra security
 * - The raw key format is: "mf_live_" + 32 random hex chars
 * - Only the SHA-256 hash of the full key is stored in DynamoDB
 */
export function hashApiKey(rawKey: string): string {
  return sha256(rawKey);
}

/** Generate a raw API key with prefix for identification */
export function generateApiKey(): { raw: string; hash: string; prefix: string } {
  const randomPart = Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
  const raw = `mf_live_${randomPart}`;
  return {
    raw,
    hash: hashApiKey(raw),
    prefix: raw.substring(0, 12),
  };
}
