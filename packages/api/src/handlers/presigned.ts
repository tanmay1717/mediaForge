import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { S3Service } from '../services/s3-service';
import { createSuccessResponse } from '../middleware/error-handler';
import { generateUlid, buildOriginalKey, getExtension } from '@media-forge/core';

const s3 = new S3Service();

/**
 * POST /v1/upload/presigned — generate a pre-signed S3 URL for direct browser upload.
 *
 * TODO:
 * - Generate a new assetId (ULID)
 * - Build the S3 key using buildOriginalKey
 * - Generate a pre-signed PUT URL with 1-hour expiry
 * - Return { uploadUrl, assetId, key } so the client can:
 *   1. PUT the file directly to S3 using the pre-signed URL
 *   2. Call POST /v1/upload/confirm with the assetId to finalize metadata
 */
export async function handlePresignedUrl(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { fileName, mimeType, folderId } = ctx.body as {
    fileName: string; mimeType: string; folderId: string;
  };

  const assetId = generateUlid();
  const ext = getExtension(fileName);
  const key = buildOriginalKey(ctx.userId, folderId, assetId, ext);
  const uploadUrl = await s3.generatePresignedUploadUrl(key, mimeType);

  return createSuccessResponse({ uploadUrl, assetId, key });
}
