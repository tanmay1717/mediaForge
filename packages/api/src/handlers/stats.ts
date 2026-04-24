import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse } from '../middleware/error-handler';
import { DynamoService } from '../services/dynamo-service';

const assetsDb = new DynamoService(process.env.ASSETS_TABLE!);
const foldersDb = new DynamoService(process.env.FOLDERS_TABLE!);

export async function handleGetStats(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  // Query assets for this user
  const assets = await assetsDb.query<{ fileSize: number; assetType: string }>({
    indexName: 'userId-createdAt-index',
    keyCondition: 'userId = :uid',
    expressionValues: { ':uid': ctx.userId },
    limit: 1000,
  });

  // Query folders for this user
  const folders = await foldersDb.query<Record<string, unknown>>({
    indexName: 'userId-path-index',
    keyCondition: 'userId = :uid',
    expressionValues: { ':uid': ctx.userId },
    limit: 1000,
  });

  const totalStorage = assets.items.reduce((sum, a) => sum + (a.fileSize || 0), 0);
  const assetsByType: Record<string, number> = {};
  assets.items.forEach(a => {
    const t = a.assetType || 'unknown';
    assetsByType[t] = (assetsByType[t] || 0) + 1;
  });

  return createSuccessResponse({
    totalAssets: assets.items.length,
    totalStorage,
    totalFolders: folders.items.length,
    assetsByType,
  });
}
