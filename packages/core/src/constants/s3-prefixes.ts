/** S3 key prefixes for organizing objects in the bucket */
export const S3_PREFIX = {
  ORIGINALS: 'originals',
  TRANSFORMS: 'transforms',
  TEMP: 'temp',
} as const;

/** Build the S3 key for an original asset */
export function buildOriginalKey(
  userId: string,
  folderId: string,
  assetId: string,
  ext: string,
): string {
  return `${S3_PREFIX.ORIGINALS}/${userId}/${folderId}/${assetId}.${ext}`;
}

/** Build the S3 key for a cached transform */
export function buildTransformKey(
  userId: string,
  cacheHash: string,
  assetId: string,
  ext: string,
): string {
  return `${S3_PREFIX.TRANSFORMS}/${userId}/${cacheHash}/${assetId}.${ext}`;
}
