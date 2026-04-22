/** Asset type categories — determines which transformer pipeline runs */
export enum AssetType {
  IMAGE = 'image',
  VIDEO = 'video',
  DOCUMENT = 'document',
  SVG = 'svg',
  RAW = 'raw',
}

/** Lifecycle status — soft-deleted assets are cleaned up by TTL */
export enum AssetStatus {
  ACTIVE = 'active',
  PROCESSING = 'processing',
  DELETED = 'deleted',
  FAILED = 'failed',
}

/** Core asset record stored in DynamoDB Assets table */
export interface Asset {
  assetId: string;
  userId: string;
  folderId: string;
  fileName: string;
  originalKey: string; // S3 key: originals/{userId}/{folderId}/{assetId}.{ext}
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  duration: number | null; // video only, seconds
  metadata: Record<string, unknown>; // EXIF + custom key-values
  tags: string[];
  assetType: AssetType;
  status: AssetStatus;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

/** Lightweight projection for list/grid views */
export interface AssetSummary {
  assetId: string;
  userId: string;
  folderId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  assetType: AssetType;
  status: AssetStatus;
  createdAt: string;
}
