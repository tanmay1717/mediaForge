import { CloudFrontResultResponse } from 'aws-lambda';
import { formatToMime } from './format-negotiator';
import { OutputFormat } from '@media-forge/core';

/**
 * Build a CloudFront origin-response with correct headers.
 *
 * TODO:
 * - Set Content-Type based on the output format
 * - Set Cache-Control: public, max-age=2592000, immutable
 * - Set Vary: Accept (because f_auto produces different output per browser)
 * - Base64-encode the body (CloudFront requires this for binary responses)
 * - Set status to 200
 */
export function buildImageResponse(
  body: Buffer,
  format: Exclude<OutputFormat, 'auto'>,
): CloudFrontResultResponse {
  return {
    status: '200',
    statusDescription: 'OK',
    headers: {
      'content-type': [{ key: 'Content-Type', value: formatToMime(format) }],
      'cache-control': [{ key: 'Cache-Control', value: 'public, max-age=2592000, immutable' }],
      'vary': [{ key: 'Vary', value: 'Accept' }],
    },
    bodyEncoding: 'base64',
    body: body.toString('base64'),
  };
}

export function buildErrorResponse(status: string, message: string): CloudFrontResultResponse {
  return {
    status,
    statusDescription: message,
    headers: {
      'content-type': [{ key: 'Content-Type', value: 'application/json' }],
      'cache-control': [{ key: 'Cache-Control', value: 'no-cache' }],
    },
    body: JSON.stringify({ error: message }),
  };
}
