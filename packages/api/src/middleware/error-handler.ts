import { APIGatewayProxyResult } from 'aws-lambda';

/**
 * Structured error response builder.
 * All API errors follow the shape: { success: false, error: { code, message, details? } }
 */
export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
}

export function createErrorResponse(error: ApiError): APIGatewayProxyResult {
  return {
    statusCode: error.statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    }),
  };
}

export function createSuccessResponse(data: unknown, statusCode = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    body: JSON.stringify({ success: true, data }),
  };
}

function corsHeaders(): Record<string, string> {
  // TODO: Restrict to dashboard domain in production
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,x-api-key',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  };
}

/** Convert unknown caught errors into structured ApiError */
export function normalizeError(err: unknown): ApiError {
  if (typeof err === 'object' && err !== null && 'statusCode' in err) {
    return err as ApiError;
  }
  console.error('Unhandled error:', err);
  return {
    statusCode: 500,
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
  };
}
