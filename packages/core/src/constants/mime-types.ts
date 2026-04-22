import { AssetType } from '../types/asset';

/** Map MIME types to asset categories */
export const MIME_TYPE_MAP: Record<string, AssetType> = {
  'image/jpeg': AssetType.IMAGE,
  'image/png': AssetType.IMAGE,
  'image/webp': AssetType.IMAGE,
  'image/avif': AssetType.IMAGE,
  'image/gif': AssetType.IMAGE,
  'image/tiff': AssetType.IMAGE,
  'image/svg+xml': AssetType.SVG,
  'video/mp4': AssetType.VIDEO,
  'video/webm': AssetType.VIDEO,
  'video/quicktime': AssetType.VIDEO,
  'application/pdf': AssetType.DOCUMENT,
};

/** All MIME types we accept for upload */
export const ALLOWED_MIME_TYPES = Object.keys(MIME_TYPE_MAP);

/** Resolve AssetType from a MIME string, defaults to RAW */
export function resolveAssetType(mimeType: string): AssetType {
  return MIME_TYPE_MAP[mimeType] ?? AssetType.RAW;
}
