import { Asset, AssetSummary } from './asset';
import { Folder } from './folder';

/** Standard API envelope for all responses */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string; details?: unknown };
}

/** Paginated list response with cursor-based pagination */
export interface PaginatedResponse<T> {
  items: T[];
  nextCursor?: string;
  totalCount?: number;
}

// ── Upload ──────────────────────────────────────────────
export interface UploadRequest {
  folderId: string;
  tags?: string[];
}

export interface UploadResponse {
  asset: Asset;
  deliveryUrl: string;
}

export interface PresignedUrlRequest {
  fileName: string;
  mimeType: string;
  folderId: string;
}

export interface PresignedUrlResponse {
  uploadUrl: string;
  assetId: string;
  key: string;
}

// ── Assets ──────────────────────────────────────────────
export interface ListAssetsQuery {
  folderId?: string;
  assetType?: string;
  search?: string;
  sortBy?: 'createdAt' | 'fileName' | 'fileSize';
  sortOrder?: 'asc' | 'desc';
  cursor?: string;
  limit?: number;
}

export interface UpdateAssetRequest {
  fileName?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export interface MoveAssetsRequest {
  assetIds: string[];
  targetFolderId: string;
}

export interface BulkDeleteRequest {
  assetIds: string[];
}

// ── Folders ─────────────────────────────────────────────
export interface CreateFolderRequest {
  name: string;
  parentFolderId?: string;
}

export interface UpdateFolderRequest {
  name?: string;
  parentFolderId?: string;
}

// ── Auth ────────────────────────────────────────────────
export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
  expiresIn: number;
}

// ── Cache ───────────────────────────────────────────────
export interface InvalidateCacheRequest {
  assetId?: string;
  folderId?: string;
  all?: boolean;
}

// ── Stats ───────────────────────────────────────────────
export interface UsageStats {
  totalAssets: number;
  totalStorage: number;
  totalFolders: number;
  assetsByType: Record<string, number>;
}
