import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { parseRequestContext, RequestContext } from './middleware/request-context';
import { authenticate } from './middleware/auth';
import { matchRoute } from './router';
import { handleCorsOptions } from './middleware/cors';
import { createErrorResponse, normalizeError } from './middleware/error-handler';

/**
 * Lambda handler entry point — API Gateway proxy integration.
 *
 * Flow:
 * 1. Handle CORS preflight (OPTIONS) immediately
 * 2. Parse the request into a typed RequestContext
 * 3. Match the route (method + path)
 * 4. If not a public route, authenticate (Cognito JWT or API key)
 * 5. Execute the matched handler
 * 6. Catch and normalize any errors
 */
export async function handler(
  event: APIGatewayProxyEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleCorsOptions();
  }

  try {
    // Parse request
    const partialCtx = parseRequestContext(event);

    // Match route
    const route = matchRoute(partialCtx.method, partialCtx.path);
    if (!route) {
      return createErrorResponse({
        statusCode: 404,
        code: 'NOT_FOUND',
        message: `No route for ${partialCtx.method} ${partialCtx.path}`,
      });
    }

    // Authenticate if needed
    let userId = 'anonymous';
    let isApiKeyAuth = false;

    if (!route.isPublic) {
      const cognitoSub = event.requestContext?.authorizer?.claims?.sub as string | undefined;
      const authResult = await authenticate(partialCtx.headers, cognitoSub);
      userId = authResult.userId;
      isApiKeyAuth = authResult.isApiKeyAuth;
    }

    // Build full context
    const ctx: RequestContext = {
      ...partialCtx,
      userId,
      isApiKeyAuth,
      pathParams: { ...partialCtx.pathParams, ...route.pathParams },
    };

    // Execute handler
    return await route.handler(ctx);
  } catch (err) {
    const apiError = normalizeError(err);
    return createErrorResponse(apiError);
  }
}
