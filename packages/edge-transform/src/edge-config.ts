/**
 * Lambda@Edge cannot use environment variables.
 * These values are hardcoded at build time.
 * Update and redeploy when infrastructure changes.
 */
export const EDGE_CONFIG = {
  S3_BUCKET: 'mediaforge-dev-assets',
  S3_REGION: 'us-east-1',
} as const;
