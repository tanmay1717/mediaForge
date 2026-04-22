import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Handle CORS preflight (OPTIONS) requests.
 *
 * TODO:
 * - Read the DASHBOARD_DOMAIN env var for the allowed origin
 * - In dev, allow "*"; in prod, restrict to the dashboard domain
 * - Return proper Access-Control-Allow-* headers
 */
export function handleCorsOptions(): APIGatewayProxyResult {
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': process.env.DASHBOARD_DOMAIN || '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
      'Access-Control-Max-Age': '86400',
    },
    body: '',
  };
}
