import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { S3Service } from '../services/s3-service';
import { CloudFrontService } from '../services/cloudfront-service';
import { createSuccessResponse } from '../middleware/error-handler';
import { InvalidateCacheRequest, S3_PREFIX } from '@media-forge/core';

const s3 = new S3Service();
const cf = new CloudFrontService();

/**
 * POST /v1/cache/invalidate — purge cached transforms.
 *
 * TODO:
 * - If assetId: List + delete all S3 objects under transforms/.../{assetId}.*
 *   Then invalidate CloudFront paths matching the asset
 * - If folderId: Invalidate all assets in the folder
 * - If all: Invalidate /* on CloudFront (use sparingly)
 */
export async function handleInvalidateCache(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { assetId, folderId, all } = ctx.body as InvalidateCacheRequest;

  if (all) {
    await cf.invalidateAll();
    return createSuccessResponse({ message: 'Full cache invalidation started' });
  }

  if (assetId) {
    // Delete S3 cached transforms for this asset
    const prefix = `${S3_PREFIX.TRANSFORMS}/${ctx.userId}/`;
    const keys = await s3.listByPrefix(prefix);
    const matchingKeys = keys.filter((k) => k.includes(assetId));
    for (const key of matchingKeys) {
      await s3.delete(key);
    }
    // TODO: Build CloudFront invalidation paths from the asset's folder path
    return createSuccessResponse({ message: 'Asset cache invalidated', deletedVariants: matchingKeys.length });
  }

  // TODO: Implement folderId-based invalidation
  return createSuccessResponse({ message: 'Cache invalidation not yet implemented for this scope' });
}
