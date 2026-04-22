import { RequestContext } from '../middleware/request-context';
import { APIGatewayProxyResult } from 'aws-lambda';
import { createSuccessResponse } from '../middleware/error-handler';
import { generateApiKey } from '@media-forge/core';

/**
 * API key management handlers.
 *
 * TODO:
 * - handleCreateApiKey: Generate key using generateApiKey(),
 *   store the hash in DynamoDB, return the raw key ONCE (never stored)
 *
 * - handleListApiKeys: Query DynamoDB for all keys belonging to userId,
 *   return label, prefix, isActive, lastUsedAt (never return hash or raw key)
 *
 * - handleDeleteApiKey: Deactivate or delete the key from DynamoDB
 */
export async function handleCreateApiKey(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { label } = ctx.body as { label: string };
  const key = generateApiKey();
  // TODO: Store { keyHash, userId, label, prefix, isActive, createdAt } in DynamoDB
  return createSuccessResponse({
    rawKey: key.raw, // Show once — user must copy it now
    prefix: key.prefix,
    label,
    message: 'Save this key — it will not be shown again',
  }, 201);
}

export async function handleListApiKeys(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  // TODO: Query DynamoDB for keys where userId = ctx.userId
  return createSuccessResponse({ keys: [] });
}

export async function handleDeleteApiKey(ctx: RequestContext): Promise<APIGatewayProxyResult> {
  const { id } = ctx.pathParams;
  // TODO: Delete or deactivate the key
  return createSuccessResponse({ message: 'API key revoked', id });
}
