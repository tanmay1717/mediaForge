import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse } from '../middleware/error-handler';

/**
 * POST /v1/upload/url — fetch a file from a remote URL and store it.
 *
 * TODO:
 * - Validate the URL (must be https, reachable)
 * - Fetch the file using node's fetch or https module
 * - Check Content-Type and Content-Length against our limits
 * - Extract the filename from the URL or Content-Disposition header
 * - Pass the buffer to AssetService.create() (same as direct upload)
 * - Return the asset record + delivery URL
 */
export async function handleUploadFromUrl(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { url, folderId, tags } = ctx.body as { url: string; folderId: string; tags?: string[] };
  // TODO: Implement URL fetch + asset creation
  return createSuccessResponse({ message: 'TODO: Implement URL upload', url, folderId });
}
