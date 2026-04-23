import { parseTransforms, validateTransformParams, sanitizePath, TRANSFORM_DEFAULTS } from '@media-forge/core';
import { ResolvedTransformParams } from '@media-forge/core';
import { negotiateFormat, extToFormat, formatToMime } from './format-negotiator';
import { analyzeQuality } from './quality-analyzer';
import { CacheManager } from './cache-manager';
import { transformImage } from './transformer/image-transformer';
import { passthrough } from './transformer/passthrough';
import { getObject } from './s3-client';

const cache = new CacheManager();

/**
 * Regular Lambda handler with Function URL.
 * Receives standard HTTP requests from CloudFront (not CloudFront events).
 *
 * URL: /v1/{type}/{transforms}/{path...}
 * Example: /v1/image/w_500,f_auto,q_80/products/hero.jpg
 */
export async function handler(event: {
  rawPath: string;
  headers: Record<string, string>;
  requestContext: { http: { method: string } };
}): Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
  isBase64Encoded: boolean;
}> {
  const uri = event.rawPath;
  const acceptHeader = event.headers?.['accept'] || event.headers?.['Accept'] || '';

  try {
    // Parse: /v1/{type}/{transforms}/{path...}
    const match = uri.match(/^\/v1\/(\w+)\/([^/]+)\/(.+)$/);
    if (!match) {
      // Try raw passthrough: /v1/raw/{path}
      const rawMatch = uri.match(/^\/v1\/raw\/(.+)$/);
      if (rawMatch) {
        const buffer = await getObject(`originals/${rawMatch[1]}`);
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/octet-stream',
            'Cache-Control': 'public, max-age=2592000, immutable',
          },
          body: buffer.toString('base64'),
          isBase64Encoded: true,
        };
      }
      return { statusCode: 400, headers: {}, body: JSON.stringify({ error: 'Invalid URL format' }), isBase64Encoded: false };
    }

    const [, assetType, transformSegment, assetPath] = match;
    const safePath = sanitizePath(assetPath);

    // Parse transforms
    const params = parseTransforms(transformSegment);
    const validation = validateTransformParams(params);
    if (!validation.valid) {
      return { statusCode: 400, headers: {}, body: JSON.stringify({ error: validation.errors }), isBase64Encoded: false };
    }

    // Resolve auto values
    const ext = safePath.split('.').pop() ?? 'jpg';
    const originalFormat = extToFormat(ext);
    const resolvedFormat = params.format === 'auto'
      ? negotiateFormat(acceptHeader, originalFormat)
      : (params.format ?? originalFormat);

    const resolvedQuality = params.quality === 'auto'
      ? await analyzeQuality(Buffer.alloc(0), resolvedFormat)
      : (params.quality ?? TRANSFORM_DEFAULTS.quality);

    const resolved: ResolvedTransformParams = {
      ...params,
      resolvedFormat,
      resolvedQuality,
    };

    // Check cache
    const cacheResult = await cache.checkCache('default', params, safePath, resolvedFormat);
    if (cacheResult.hit) {
      const cached = await cache.getCached(cacheResult.s3Key);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': formatToMime(resolvedFormat),
          'Cache-Control': 'public, max-age=2592000, immutable',
          'Vary': 'Accept',
          'X-Cache': 'HIT-S3',
        },
        body: cached.toString('base64'),
        isBase64Encoded: true,
      };
    }

    // Fetch original + transform
    const originalKey = `originals/${safePath}`;
    const originalBuffer = await getObject(originalKey);

    let outputBuffer: Buffer;
    if (assetType === 'image') {
      outputBuffer = await transformImage(originalBuffer, resolved);
    } else {
      outputBuffer = await passthrough(originalBuffer);
    }

    // Cache result
    await cache.writeCache(cacheResult.s3Key, outputBuffer, formatToMime(resolvedFormat));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': formatToMime(resolvedFormat),
        'Cache-Control': 'public, max-age=2592000, immutable',
        'Vary': 'Accept',
        'X-Cache': 'MISS',
      },
      body: outputBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (err) {
    console.error('Transform error:', err);
    return {
      statusCode: 500,
      headers: {},
      body: JSON.stringify({ error: 'Transform failed', details: String(err) }),
      isBase64Encoded: false,
    };
  }
}
