import { RequestContext } from '../middleware/request-context';
import { AssetService } from '../services/asset-service';
import { createSuccessResponse } from '../middleware/error-handler';
import { APIGatewayProxyResult } from 'aws-lambda';
import { validateUpload, buildDeliveryUrl } from '@media-forge/core';

const assets = new AssetService();
const CDN_DOMAIN = process.env.CDN_DOMAIN!;

/**
 * POST /v1/upload — multipart file upload.
 *
 * TODO:
 * - Parse multipart form data from the request body
 *   (API Gateway base64-encodes binary bodies — decode first)
 * - Extract: file buffer, fileName, mimeType, folderId, tags
 * - Validate with validateUpload()
 * - Call assetService.create()
 * - Build the delivery URL using buildDeliveryUrl()
 * - Return the asset record + delivery URL
 */
export async function handleUpload(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  // TODO: Parse multipart body — see note above
  // Stub: assumes JSON body for now
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
  const deliveryUrl = buildDeliveryUrl({}, `${asset.folderId}/${asset.fileName}`, CDN_DOMAIN);

  return createSuccessResponse({ asset, deliveryUrl }, 201);
}
