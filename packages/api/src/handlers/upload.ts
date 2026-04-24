import { RequestContext } from '../middleware/request-context';
import { AssetService } from '../services/asset-service';
import { createSuccessResponse } from '../middleware/error-handler';
import { APIGatewayProxyResult } from 'aws-lambda';
import { validateUpload } from '@media-forge/core';

const assets = new AssetService();
const CDN_DOMAIN = process.env.CDN_DOMAIN || 'cdn.tanmayshetty.com';

export async function handleUpload(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { fileName, mimeType, folderId, tags, fileBase64 } = ctx.body as {
    fileName: string; mimeType: string; folderId: string;
    tags?: string[]; fileBase64: string;
  };

  const fileBuffer = Buffer.from(fileBase64, 'base64');
  const validation = validateUpload(fileName, mimeType, fileBuffer.length);
  if (!validation.valid) {
    return { statusCode: 400, headers: {}, body: JSON.stringify({ success: false, error: validation.errors }) };
  }

  const asset = await assets.create(ctx.userId, folderId, fileName, mimeType, fileBuffer, tags);

  // Build CDN URLs — strip "originals/" prefix from the S3 key
  const cdnPath = asset.originalKey.replace(/^originals\//, '');
  const deliveryUrls = {
    original: `https://${CDN_DOMAIN}/v1/raw/${cdnPath}`,
    optimized: `https://${CDN_DOMAIN}/v1/image/f_auto,q_auto/${cdnPath}`,
    thumbnail: `https://${CDN_DOMAIN}/v1/image/w_200,h_200,c_cover,f_auto/${cdnPath}`,
    example: `https://${CDN_DOMAIN}/v1/image/w_800,f_auto,q_auto/${cdnPath}`,
  };

  return createSuccessResponse({ asset, deliveryUrls }, 201);
}
