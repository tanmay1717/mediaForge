import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse } from '../middleware/error-handler';
import { MoveAssetsRequest, BulkDeleteRequest } from '@media-forge/core';

/**
 * Bulk operations on assets.
 *
 * TODO:
 * - handleMoveAssets: Validate all assetIds belong to the user,
 *   validate target folder exists, update folderId on each asset,
 *   update assetCount/totalSize on source and target folders
 *
 * - handleBulkDelete: Validate all assetIds belong to the user,
 *   soft-delete each asset, update folder counts
 *
 * - handleBulkTag: Add or remove tags from multiple assets at once
 */
export async function handleMoveAssets(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { assetIds, targetFolderId } = ctx.body as MoveAssetsRequest;
  // TODO: Implement bulk move
  return createSuccessResponse({ moved: assetIds.length, targetFolderId });
}

export async function handleBulkDelete(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { assetIds } = ctx.body as BulkDeleteRequest;
  // TODO: Implement bulk soft-delete
  return createSuccessResponse({ deleted: assetIds.length });
}
