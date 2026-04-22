import { CloudFrontRequestEvent, CloudFrontResultResponse, Context } from 'aws-lambda';
import { parseTransforms, sanitizePath, AssetType } from '@media-forge/core';
import { validateTransformParams } from '@media-forge/core';
import { TRANSFORM_DEFAULTS } from '@media-forge/core';
import { ResolvedTransformParams } from '@media-forge/core';
import { negotiateFormat, extToFormat } from './format-negotiator';
import { analyzeQuality } from './quality-analyzer';
import { CacheManager } from './cache-manager';
import { transformImage } from './transformer/image-transformer';
import { passthrough } from './transformer/passthrough';
import { buildImageResponse, buildErrorResponse } from './response-builder';
import { getObject } from './s3-client';

const cache = new CacheManager();

/**
 * Lambda@Edge origin-request handler.
 *
 * Triggered by CloudFront on cache miss. Parses the URL, checks for
 * a cached transform in S3, transforms on the fly if needed, and
 * returns the result to CloudFront for caching.
 *
 * URL format: /v1/{assetType}/{transforms}/{path...}
 * Example:    /v1/image/w_500,f_auto,q_80/products/hero.jpg
 *
 * Flow:
 * 1. Parse the URI into: assetType, transforms segment, asset path
 * 2. Parse transforms into TransformParams
 * 3. Validate params
 * 4. Resolve f_auto (content negotiation) and q_auto (smart quality)
 * 5. Check S3 transform cache
 * 6. If cache hit → rewrite origin to cached S3 key
 * 7. If cache miss → fetch original, transform, cache result, return response
 */
export async function handler(
  event: CloudFrontRequestEvent,
  _context: Context,
): Promise<CloudFrontResultResponse> {
  const request = event.Records[0].cf.request;
  const uri = request.uri;

  try {
    // Step 1: Parse URI
    // Expected: /v1/{type}/{transforms}/{path...}
    const match = uri.match(/^\/v1\/(\w+)\/([^/]+)\/(.+)$/);
    if (!match) {
      // No transform segment — might be /v1/raw/{path}
      const rawMatch = uri.match(/^\/v1\/raw\/(.+)$/);
      if (rawMatch) {
        // TODO: Rewrite request.uri to originals/{path} for S3
        request.uri = `/originals/${rawMatch[1]}`;
        return request as unknown as CloudFrontResultResponse;
      }
      return buildErrorResponse('400', 'Invalid URL format');
    }

    const [, assetType, transformSegment, assetPath] = match;
    const safePath = sanitizePath(assetPath);

    // Step 2: Parse transforms
    const params = parseTransforms(transformSegment);

    // Step 3: Validate
    const validation = validateTransformParams(params);
    if (!validation.valid) {
      return buildErrorResponse('400', validation.errors.join(', '));
    }

    // Step 4: Resolve auto values
    const ext = safePath.split('.').pop() ?? 'jpg';
    const originalFormat = extToFormat(ext);

    const resolvedFormat = params.format === 'auto'
      ? negotiateFormat(request.headers?.accept?.[0]?.value, originalFormat)
      : (params.format ?? originalFormat);

    const resolvedQuality = params.quality === 'auto'
      ? await analyzeQuality(Buffer.alloc(0), resolvedFormat) // TODO: pass actual buffer
      : (params.quality ?? TRANSFORM_DEFAULTS.quality);

    const resolved: ResolvedTransformParams = {
      ...params,
      resolvedFormat,
      resolvedQuality,
    };

    // Step 5: Check cache
    // TODO: Extract userId from the path or a custom header
    const userId = 'default';
    const cacheResult = await cache.checkCache(userId, params, safePath, resolvedFormat);

    if (cacheResult.hit) {
      // Step 6: Cache hit → rewrite to cached S3 key
      request.uri = `/${cacheResult.s3Key}`;
      return request as unknown as CloudFrontResultResponse;
    }

    // Step 7: Cache miss → transform
    // TODO: Build the correct original S3 key from the asset path
    const originalKey = `originals/${safePath}`;
    const originalBuffer = await getObject(originalKey);

    let outputBuffer: Buffer;
    if (assetType === 'image') {
      outputBuffer = await transformImage(originalBuffer, resolved);
    } else {
      // TODO: Route to video/pdf/passthrough transformers
      outputBuffer = await passthrough(originalBuffer);
    }

    // Write to cache
    await cache.writeCache(
      cacheResult.s3Key,
      outputBuffer,
      `image/${resolvedFormat}`,
    );

    // Return the transformed image
    return buildImageResponse(outputBuffer, resolvedFormat);
  } catch (err) {
    console.error('Transform error:', err);
    return buildErrorResponse('500', 'Transform failed');
  }
}
