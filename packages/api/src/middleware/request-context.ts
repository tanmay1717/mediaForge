import { APIGatewayProxyEvent } from 'aws-lambda';

/**
 * Typed request context parsed from the API Gateway proxy event.
 * Available to all handlers after middleware processing.
 */
export interface RequestContext {
  userId: string;
  method: string;
  path: string;
  pathParams: Record<string, string>;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string>;
  isApiKeyAuth: boolean;
}

/**
 * Parse an API Gateway event into a typed RequestContext.
 *
 * TODO:
 * - Extract method, path from event
 * - Parse and lowercase all headers
 * - Parse query string parameters (handle null)
 * - Parse JSON body if Content-Type is application/json (handle parse errors)
 * - Extract pathParameters from event (handle null)
 * - userId is set later by auth middleware
 */
export function parseRequestContext(event: APIGatewayProxyEvent): Omit<RequestContext, 'userId' | 'isApiKeyAuth'> {
  const headers: Record<string, string> = {};
  for (const [key, value] of Object.entries(event.headers || {})) {
    if (value) headers[key.toLowerCase()] = value;
  }

  let body: unknown = null;
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch {
      body = event.body;
    }
  }

  return {
    method: event.httpMethod,
    path: event.path,
    pathParams: (event.pathParameters || {}) as Record<string, string>,
    query: (event.queryStringParameters || {}) as Record<string, string>,
    body,
    headers,
  };
}
