import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { AssetService } from '../services/asset-service';
import { createSuccessResponse, createErrorResponse } from '../middleware/error-handler';

const assets = new AssetService();

/**
 * Asset CRUD handlers.
 *
 * TODO:
 * - listAssets: Parse query params (folderId, type, search, sort, cursor, limit)
 *   → Call appropriate AssetService method → Return paginated response
 * - getAsset: Parse assetId from path → Verify ownership → Return full asset
 * - updateAsset: Parse assetId + update body → Verify ownership → Partial update
 * - deleteAsset: Parse assetId → Verify ownership → Soft delete
 */
export async function handleListAssets(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { folderId, cursor, limit } = ctx.query;
  const result = folderId
    ? await assets.listByFolder(folderId, cursor, Number(limit) || 50)
    : await assets.listByUser(ctx.userId, cursor, Number(limit) || 50);
  return createSuccessResponse(result);
}

export async function handleGetAsset(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const asset = await assets.getById(ctx.pathParams.id);
  if (!asset || asset.userId !== ctx.userId) {
    return createErrorResponse({ statusCode: 404, code: 'NOT_FOUND', message: 'Asset not found' });
  }
  return createSuccessResponse(asset);
}

export async function handleUpdateAsset(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const asset = await assets.getById(ctx.pathParams.id);
  if (!asset || asset.userId !== ctx.userId) {
    return createErrorResponse({ statusCode: 404, code: 'NOT_FOUND', message: 'Asset not found' });
  }
  await assets.update(ctx.pathParams.id, ctx.body as Record<string, unknown>);
  return createSuccessResponse({ message: 'Updated' });
}

export async function handleDeleteAsset(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const asset = await assets.getById(ctx.pathParams.id);
  if (!asset || asset.userId !== ctx.userId) {
    return createErrorResponse({ statusCode: 404, code: 'NOT_FOUND', message: 'Asset not found' });
  }
  await assets.softDelete(ctx.pathParams.id);
  return createSuccessResponse({ message: 'Deleted' });
}
