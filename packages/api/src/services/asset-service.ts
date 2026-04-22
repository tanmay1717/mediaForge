import { Asset, AssetSummary, AssetStatus, AssetType } from '@media-forge/core';
import { DynamoService } from './dynamo-service';
import { S3Service } from './s3-service';
import {
  generateUlid, buildOriginalKey, resolveAssetType, getExtension,
} from '@media-forge/core';

const TABLE = process.env.ASSETS_TABLE!;
const db = new DynamoService(TABLE);
const s3 = new S3Service();

/**
 * Asset business logic — coordinates S3 + DynamoDB for asset CRUD.
 *
 * TODO for each method:
 * - create: Generate ULID, extract metadata, upload to S3, write DynamoDB record
 * - getById: Fetch from DynamoDB by assetId
 * - listByFolder: Query GSI1 (folderId-createdAt) with pagination
 * - listByUser: Query GSI2 (userId-createdAt) with pagination
 * - update: Partial update of metadata fields (fileName, tags, metadata)
 * - softDelete: Set status=DELETED and updatedAt, don't remove S3 object yet
 * - hardDelete: Remove S3 object + DynamoDB record (called by cleanup job)
 * - moveToFolder: Update folderId, update old/new folder assetCount/totalSize
 * - bulkDelete: Soft-delete multiple assets in a batch
 */
export class AssetService {
  async create(
    userId: string,
    folderId: string,
    fileName: string,
    mimeType: string,
    fileBuffer: Buffer,
    tags: string[] = [],
  ): Promise<Asset> {
    const assetId = generateUlid();
    const ext = getExtension(fileName);
    const s3Key = buildOriginalKey(userId, folderId, assetId, ext);
    const assetType = resolveAssetType(mimeType);
    const now = new Date().toISOString();

    // TODO: Extract width/height/duration using metadata-extractor service
    // TODO: Upload to S3
    // TODO: Write to DynamoDB
    // TODO: Update folder assetCount and totalSize

    await s3.upload(s3Key, fileBuffer, mimeType);

    const asset: Asset = {
      assetId, userId, folderId, fileName,
      originalKey: s3Key, mimeType,
      fileSize: fileBuffer.length,
      width: null, height: null, duration: null,
      metadata: {}, tags, assetType,
      status: AssetStatus.ACTIVE,
      createdAt: now, updatedAt: now,
    };

    await db.putItem(asset);
    return asset;
  }

  async getById(assetId: string): Promise<Asset | null> {
    return db.getItem<Asset>({ assetId });
  }

  async listByFolder(folderId: string, cursor?: string, limit = 50) {
    return db.query<AssetSummary>({
      indexName: 'folderId-createdAt-index',
      keyCondition: 'folderId = :fid',
      expressionValues: { ':fid': folderId },
      limit, cursor, scanForward: false,
    });
  }

  async listByUser(userId: string, cursor?: string, limit = 50) {
    return db.query<AssetSummary>({
      indexName: 'userId-createdAt-index',
      keyCondition: 'userId = :uid',
      expressionValues: { ':uid': userId },
      limit, cursor, scanForward: false,
    });
  }

  async update(assetId: string, updates: Partial<Pick<Asset, 'fileName' | 'tags' | 'metadata'>>) {
    await db.updateItem({ assetId }, { ...updates, updatedAt: new Date().toISOString() });
  }

  async softDelete(assetId: string): Promise<void> {
    await db.updateItem({ assetId }, {
      status: AssetStatus.DELETED,
      updatedAt: new Date().toISOString(),
    });
  }

  // TODO: Implement hardDelete, moveToFolder, bulkDelete
}
