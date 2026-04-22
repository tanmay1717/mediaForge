import { RequestContext } from './request-context';
import { DynamoService } from '../services/dynamo-service';
import { hashApiKey } from '@media-forge/core';

/**
 * Dual authentication middleware: Cognito JWT OR API key.
 *
 * TODO:
 * - Check if the request has an Authorization header with a Bearer token
 *   → If yes: extract userId from the API Gateway Cognito authorizer context
 *     (event.requestContext.authorizer.claims.sub)
 *     Set isApiKeyAuth = false
 *
 * - Else check if the request has an x-api-key header
 *   → If yes: SHA-256 hash the key, look it up in DynamoDB ApiKeys table
 *     → If found and isActive: set userId from the key record, isApiKeyAuth = true
 *     → If not found or inactive: throw 401
 *
 * - If neither header is present: throw 401 Unauthorized
 *
 * - Update lastUsedAt on the API key record (fire-and-forget, don't block response)
 */
export async function authenticate(
  headers: Record<string, string>,
  cognitoUserId?: string,
): Promise<{ userId: string; isApiKeyAuth: boolean }> {
  // Path 1: Cognito JWT — userId comes from API Gateway authorizer context
  if (cognitoUserId) {
    return { userId: cognitoUserId, isApiKeyAuth: false };
  }

  // Path 2: API Key
  const apiKey = headers['x-api-key'];
  if (apiKey) {
    const keyHash = hashApiKey(apiKey);
    // TODO: Look up keyHash in DynamoDB ApiKeys table
    // TODO: Verify isActive === true
    // TODO: Return userId from the key record
    // TODO: Update lastUsedAt in background

    // Stub: will be implemented when DynamoService is complete
    throw new Error('API key auth not yet implemented');
  }

  throw { statusCode: 401, message: 'Missing authentication' };
}
