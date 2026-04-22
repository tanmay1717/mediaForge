import { generateCacheKey, buildTransformKey, getExtension } from '@media-forge/core';
import { TransformParams } from '@media-forge/core';
import { getObject, putObject, objectExists } from './s3-client';

/**
 * Manages the S3 transform cache.
 *
 * - checkCache: Generate cache key → check if S3 object exists
 * - getCached: Fetch the cached variant from S3
 * - writeCache: Write a new transform result to S3
 *
 * Cache key is deterministic: SHA-256(transforms + path) → first 16 hex chars
 * This means the same URL always maps to the same S3 object.
 */
export class CacheManager {
  async checkCache(
    userId: string,
    params: TransformParams,
    assetPath: string,
    outputExt: string,
  ): Promise<{ hit: boolean; cacheKey: string; s3Key: string }> {
    const cacheHash = generateCacheKey(params, assetPath);
    const assetId = assetPath.split('/').pop()?.split('.')[0] ?? 'unknown';
    const s3Key = buildTransformKey(userId, cacheHash, assetId, outputExt);

    const hit = await objectExists(s3Key);
    return { hit, cacheKey: cacheHash, s3Key };
  }

  async getCached(s3Key: string): Promise<Buffer> {
    return getObject(s3Key);
  }

  async writeCache(s3Key: string, buffer: Buffer, contentType: string): Promise<void> {
    await putObject(s3Key, buffer, contentType);
  }
}
